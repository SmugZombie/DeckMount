# Decky Network Shares

Decky Loader plugin for Steam Deck Game Mode / Steam Big Picture that mounts and browses SMB/CIFS and NFS network shares.

## Features

- Add SMB/CIFS shares by host, share name, username/password, domain, SMB version, or guest mode.
- Add NFS exports by host and export path.
- Mount/unmount shares directly from the Decky side menu.
- Browse folders from Game Mode.
- Mounts under `/home/deck/NetworkShares/<share name>`.

## Important notes

- This plugin uses Decky root flags because Linux mount/umount operations require root. The package includes both `root` and `_root` for compatibility across Decky versions.
- SMB passwords are saved in Decky plugin settings. They are not encrypted. Use a limited network-share account.
- SteamOS may need mount helpers installed. SMB requires `mount.cifs` from `cifs-utils`; NFS requires `mount.nfs` from `nfs-utils`.
- SteamOS updates can revert packages installed outside Flatpak/Decky. If mounts stop working after an OS update, check the helper status in the plugin.

## Manual install

Copy the `decky-network-shares` folder to:

```bash
/home/deck/homebrew/plugins/decky-network-shares
```

Then restart Decky Loader or reboot the Steam Deck.

## Build from source

```bash
pnpm i
pnpm run build
```

Decky expects the install package layout to include:

```text
decky-network-shares/
  dist/index.js
  main.py
  package.json
  plugin.json
  README.md
  LICENSE
```

## Installing mount helpers on SteamOS

Check first:

```bash
which mount.cifs
which mount.nfs
```

If missing, in Desktop Mode you may need to temporarily disable read-only mode and install packages:

```bash
sudo steamos-readonly disable
sudo pacman-key --init
sudo pacman-key --populate archlinux holo
sudo pacman -Sy cifs-utils nfs-utils
sudo steamos-readonly enable
```

Only do this if you are comfortable modifying SteamOS. A future SteamOS update may remove those packages.


## v0.1.1 fixes

- Fixed add-share text inputs showing `[object Object]` by handling Decky `TextField` change events correctly.
- Moved status/helper text into a single non-overlapping vertical block.
- Added the `root` plugin flag alongside `_root` for Decky versions that expect `root`.
