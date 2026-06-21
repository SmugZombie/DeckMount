import asyncio
import json
import os
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any, Dict, List

import decky

try:
    from settings import SettingsManager
except Exception:
    SettingsManager = None

PLUGIN_NAME = "decky-network-shares"
DECK_USER = os.environ.get("DECKY_USER", "deck")
DECK_HOME = os.environ.get("DECKY_USER_HOME", f"/home/{DECK_USER}")
BASE_MOUNT_DIR = Path(DECK_HOME) / "NetworkShares"
SAFE_NAME_RE = re.compile(r"[^a-zA-Z0-9_. -]+")

settings = None
if SettingsManager:
    settings_dir = os.environ.get("DECKY_PLUGIN_SETTINGS_DIR", str(Path(DECK_HOME) / "homebrew" / "settings" / PLUGIN_NAME))
    settings = SettingsManager(name="settings", settings_directory=settings_dir)
    settings.read()


def _default_config() -> Dict[str, Any]:
    return {"shares": []}


def _load_config() -> Dict[str, Any]:
    if settings:
        data = settings.getSetting("config", _default_config())
        if not isinstance(data, dict):
            data = _default_config()
        data.setdefault("shares", [])
        return data
    fallback = Path(DECK_HOME) / ".config" / PLUGIN_NAME / "settings.json"
    try:
        if fallback.exists():
            return json.loads(fallback.read_text())
    except Exception:
        pass
    return _default_config()


def _save_config(config: Dict[str, Any]) -> bool:
    config.setdefault("shares", [])
    if settings:
        settings.setSetting("config", config)
        settings.commit()
        return True
    fallback_dir = Path(DECK_HOME) / ".config" / PLUGIN_NAME
    fallback_dir.mkdir(parents=True, exist_ok=True)
    (fallback_dir / "settings.json").write_text(json.dumps(config, indent=2))
    return True


def _sanitize_name(name: str) -> str:
    name = SAFE_NAME_RE.sub("_", (name or "share").strip())[:80]
    return name or "share"


def _mountpoint_for(name: str) -> Path:
    return BASE_MOUNT_DIR / _sanitize_name(name)


def _run(cmd: List[str], timeout: int = 20) -> Dict[str, Any]:
    decky.logger.info("Running command: %s", " ".join(cmd[:3] + (["..."] if len(cmd) > 3 else [])))
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, check=False)
        return {
            "ok": proc.returncode == 0,
            "returncode": proc.returncode,
            "stdout": proc.stdout.strip(),
            "stderr": proc.stderr.strip(),
        }
    except subprocess.TimeoutExpired:
        return {"ok": False, "returncode": 124, "stdout": "", "stderr": "Command timed out"}
    except Exception as exc:
        return {"ok": False, "returncode": 1, "stdout": "", "stderr": str(exc)}


def _is_mounted(path: Path) -> bool:
    try:
        path_str = str(path.resolve())
    except Exception:
        path_str = str(path)
    try:
        with open("/proc/mounts", "r", encoding="utf-8") as fh:
            for line in fh:
                parts = line.split()
                if len(parts) >= 2 and parts[1].replace("\\040", " ") == path_str:
                    return True
    except Exception:
        pass
    return False


def _redact_share(share: Dict[str, Any]) -> Dict[str, Any]:
    out = dict(share)
    if out.get("password"):
        out["password"] = "********"
    out["mounted"] = _is_mounted(_mountpoint_for(out.get("name", "share")))
    out["mountpoint"] = str(_mountpoint_for(out.get("name", "share")))
    return out


def _find_share(name: str) -> Dict[str, Any]:
    config = _load_config()
    safe = _sanitize_name(name)
    for share in config.get("shares", []):
        if _sanitize_name(share.get("name", "")) == safe:
            return share
    raise ValueError(f"Share not found: {name}")


def _require_mount_helper(kind: str) -> str:
    helper = "mount.cifs" if kind == "smb" else "mount.nfs"
    path = shutil.which(helper)
    if not path:
        raise RuntimeError(f"Missing {helper}. Install cifs-utils for SMB or nfs-utils for NFS in Desktop Mode.")
    return path


class Plugin:
    async def _main(self):
        BASE_MOUNT_DIR.mkdir(parents=True, exist_ok=True)
        decky.logger.info("Network Shares plugin loaded. Mount base: %s", BASE_MOUNT_DIR)

    async def _unload(self):
        decky.logger.info("Network Shares plugin unloaded.")

    async def get_shares(self):
        config = _load_config()
        return [_redact_share(s) for s in config.get("shares", [])]

    async def save_share(self, share: Dict[str, Any]):
        config = _load_config()
        name = _sanitize_name(str(share.get("name", "")))
        kind = str(share.get("type", "smb")).lower()
        if kind not in ("smb", "nfs"):
            raise ValueError("type must be smb or nfs")
        if not name:
            raise ValueError("name is required")

        cleaned: Dict[str, Any] = {
            "name": name,
            "type": kind,
            "host": str(share.get("host", "")).strip(),
            "share": str(share.get("share", "")).strip(),
            "mountOptions": str(share.get("mountOptions", "")).strip(),
        }
        if not cleaned["host"] or not cleaned["share"]:
            raise ValueError("host and share are required")

        if kind == "smb":
            cleaned.update({
                "username": str(share.get("username", "")).strip(),
                "password": str(share.get("password", "")),
                "domain": str(share.get("domain", "")).strip(),
                "guest": bool(share.get("guest", False)),
                "version": str(share.get("version", "3.0")).strip() or "3.0",
            })

        shares = [s for s in config.get("shares", []) if _sanitize_name(s.get("name", "")) != name]
        shares.append(cleaned)
        config["shares"] = shares
        _save_config(config)
        return _redact_share(cleaned)

    async def delete_share(self, name: str):
        share = _find_share(name)
        mp = _mountpoint_for(share.get("name", name))
        if _is_mounted(mp):
            result = _run(["/usr/bin/umount", str(mp)])
            if not result["ok"]:
                return result
        config = _load_config()
        config["shares"] = [s for s in config.get("shares", []) if _sanitize_name(s.get("name", "")) != _sanitize_name(name)]
        _save_config(config)
        try:
            if mp.exists() and not any(mp.iterdir()):
                mp.rmdir()
        except Exception:
            pass
        return {"ok": True}

    async def mount_share(self, name: str):
        share = _find_share(name)
        kind = share.get("type", "smb")
        _require_mount_helper(kind)
        mp = _mountpoint_for(share.get("name", name))
        mp.mkdir(parents=True, exist_ok=True)
        if _is_mounted(mp):
            return {"ok": True, "mounted": True, "mountpoint": str(mp), "stdout": "Already mounted", "stderr": ""}

        if kind == "smb":
            remote = f"//{share['host']}/{share['share'].lstrip('/')}"
            opts = [
                f"uid={os.getuid() if os.getuid() != 0 else 1000}",
                f"gid={os.getgid() if os.getgid() != 0 else 1000}",
                "iocharset=utf8",
                "file_mode=0664",
                "dir_mode=0775",
                "noperm",
                f"vers={share.get('version', '3.0')}",
            ]
            if share.get("guest"):
                opts.extend(["guest", "password="])
            else:
                opts.append(f"username={share.get('username', '')}")
                opts.append(f"password={share.get('password', '')}")
                if share.get("domain"):
                    opts.append(f"domain={share.get('domain')}")
            if share.get("mountOptions"):
                opts.extend([o.strip() for o in share.get("mountOptions", "").split(",") if o.strip()])
            cmd = ["/usr/bin/mount", "-t", "cifs", remote, str(mp), "-o", ",".join(opts)]
        else:
            export = share["share"]
            if not export.startswith("/"):
                export = "/" + export
            remote = f"{share['host']}:{export}"
            opts = ["rw", "nosuid", "nodev"]
            if share.get("mountOptions"):
                opts.extend([o.strip() for o in share.get("mountOptions", "").split(",") if o.strip()])
            cmd = ["/usr/bin/mount", "-t", "nfs", remote, str(mp), "-o", ",".join(opts)]

        result = await asyncio.to_thread(_run, cmd, 30)
        result["mounted"] = _is_mounted(mp)
        result["mountpoint"] = str(mp)
        if not result["ok"] and "bad option" in result.get("stderr", ""):
            result["hint"] = "The Steam Deck may be missing cifs-utils or nfs-utils. Install the needed package in Desktop Mode."
        return result

    async def unmount_share(self, name: str):
        share = _find_share(name)
        mp = _mountpoint_for(share.get("name", name))
        if not _is_mounted(mp):
            return {"ok": True, "mounted": False, "stdout": "Already unmounted", "stderr": ""}
        result = await asyncio.to_thread(_run, ["/usr/bin/umount", str(mp)], 20)
        result["mounted"] = _is_mounted(mp)
        return result

    async def browse(self, name: str, relative_path: str = ""):
        share = _find_share(name)
        mp = _mountpoint_for(share.get("name", name)).resolve()
        if not _is_mounted(mp):
            return {"ok": False, "error": "Share is not mounted", "path": "", "items": []}
        rel = Path(relative_path or ".")
        target = (mp / rel).resolve()
        if not str(target).startswith(str(mp)):
            return {"ok": False, "error": "Invalid path", "path": "", "items": []}
        if not target.exists() or not target.is_dir():
            return {"ok": False, "error": "Path is not a directory", "path": str(rel), "items": []}
        items = []
        try:
            for entry in sorted(target.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
                try:
                    st = entry.stat()
                    items.append({
                        "name": entry.name,
                        "relativePath": str(entry.relative_to(mp)),
                        "isDir": entry.is_dir(),
                        "size": st.st_size,
                        "mtime": int(st.st_mtime),
                    })
                except PermissionError:
                    items.append({"name": entry.name, "relativePath": str(entry.relative_to(mp)), "isDir": entry.is_dir(), "size": 0, "mtime": 0, "error": "Permission denied"})
        except Exception as exc:
            return {"ok": False, "error": str(exc), "path": str(rel), "items": []}
        return {"ok": True, "path": "" if str(rel) == "." else str(rel), "mountpoint": str(mp), "items": items}

    async def health(self):
        return {
            "ok": True,
            "baseMountDir": str(BASE_MOUNT_DIR),
            "hasMountCifs": shutil.which("mount.cifs") is not None,
            "hasMountNfs": shutil.which("mount.nfs") is not None,
            "isRoot": os.geteuid() == 0,
        }
