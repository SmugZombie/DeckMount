import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  TextField,
  ToggleField,
  DropdownItem,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { useEffect, useState } from "react";
import { FaNetworkWired } from "react-icons/fa";

type Share = {
  name: string;
  type: "smb" | "nfs";
  host: string;
  share: string;
  username?: string;
  password?: string;
  domain?: string;
  guest?: boolean;
  version?: string;
  mountOptions?: string;
  mounted?: boolean;
  mountpoint?: string;
};

type BrowseItem = {
  name: string;
  relativePath: string;
  isDir: boolean;
  size: number;
  mtime: number;
  error?: string;
};

const getShares = callable<[], Share[]>("get_shares");
const saveShare = callable<[share: Share], Share>("save_share");
const deleteShare = callable<[name: string], any>("delete_share");
const mountShare = callable<[name: string], any>("mount_share");
const unmountShare = callable<[name: string], any>("unmount_share");
const browseShare = callable<[name: string, relative_path?: string], any>("browse");
const health = callable<[], any>("health");

const emptyShare: Share = {
  name: "",
  type: "smb",
  host: "",
  share: "",
  username: "",
  password: "",
  domain: "",
  guest: false,
  version: "3.0",
  mountOptions: "",
};

function fieldSetter<T extends keyof Share>(form: Share, setForm: (s: Share) => void, key: T) {
  return (value: any) => setForm({ ...form, [key]: value });
}

function sizeText(bytes: number) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function Content() {
  const [shares, setShares] = useState<Share[]>([]);
  const [form, setForm] = useState<Share>(emptyShare);
  const [selected, setSelected] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [status, setStatus] = useState<string>("Loading...");
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [helperStatus, setHelperStatus] = useState<string>("");

  const refresh = async () => {
    try {
      const h = await health();
      setHelperStatus(`root=${h.isRoot ? "yes" : "no"}, SMB=${h.hasMountCifs ? "yes" : "missing"}, NFS=${h.hasMountNfs ? "yes" : "missing"}`);
      const list = await getShares();
      setShares(list);
      if (!selected && list.length > 0) setSelected(list[0].name);
      setStatus(list.length ? "Ready" : "Add a share to get started");
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? e}`);
    }
  };

  const browse = async (shareName = selected, nextPath = path) => {
    if (!shareName) return;
    const res = await browseShare(shareName, nextPath || "");
    if (!res.ok) {
      setItems([]);
      setStatus(res.error || "Browse failed");
      return;
    }
    setPath(res.path || "");
    setItems(res.items || []);
    setStatus(res.mountpoint || "Mounted");
  };

  useEffect(() => {
    refresh();
  }, []);

  const selectedShare = shares.find((s) => s.name === selected);

  return (
    <div>
      <PanelSection title="Network Shares">
        <PanelSectionRow>
          <div className={staticClasses.Title}>Status</div>
          <div>{status}</div>
          <div style={{ opacity: 0.75, fontSize: "12px" }}>{helperStatus}</div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={refresh}>Refresh</ButtonItem>
        </PanelSectionRow>
        {shares.length > 0 && (
          <PanelSectionRow>
            <DropdownItem
              label="Share"
              selectedOption={selected}
              rgOptions={shares.map((s) => ({ data: s.name, label: `${s.name} ${s.mounted ? "●" : "○"}` }))}
              onChange={(opt: any) => {
                setSelected(opt.data);
                setPath("");
                setItems([]);
              }}
            />
          </PanelSectionRow>
        )}
        {selectedShare && (
          <>
            <PanelSectionRow>
              <div>{selectedShare.type.toUpperCase()} {selectedShare.host}/{selectedShare.share}</div>
              <div style={{ opacity: 0.75 }}>{selectedShare.mountpoint}</div>
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={async () => {
                const res = selectedShare.mounted ? await unmountShare(selectedShare.name) : await mountShare(selectedShare.name);
                toaster.toast({ title: "Network Shares", body: res.ok ? (selectedShare.mounted ? "Unmounted" : "Mounted") : (res.stderr || res.hint || "Mount failed") });
                await refresh();
              }}>{selectedShare.mounted ? "Unmount" : "Mount"}</ButtonItem>
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={() => browse(selectedShare.name, "")}>Browse Root</ButtonItem>
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={async () => {
                const res = await deleteShare(selectedShare.name);
                toaster.toast({ title: "Network Shares", body: res.ok ? "Deleted" : (res.stderr || "Delete failed") });
                setSelected("");
                setItems([]);
                setPath("");
                await refresh();
              }}>Delete Share</ButtonItem>
            </PanelSectionRow>
          </>
        )}
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => setShowAdd(!showAdd)}>{showAdd ? "Hide Add Share" : "Add Share"}</ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      {showAdd && (
        <PanelSection title="Add / Replace Share">
          <PanelSectionRow><TextField label="Name" value={form.name} onChange={fieldSetter(form, setForm, "name")} /></PanelSectionRow>
          <PanelSectionRow>
            <DropdownItem
              label="Type"
              selectedOption={form.type}
              rgOptions={[{ data: "smb", label: "SMB / CIFS" }, { data: "nfs", label: "NFS" }]}
              onChange={(opt: any) => setForm({ ...form, type: opt.data })}
            />
          </PanelSectionRow>
          <PanelSectionRow><TextField label="Host/IP" value={form.host} onChange={fieldSetter(form, setForm, "host")} /></PanelSectionRow>
          <PanelSectionRow><TextField label={form.type === "smb" ? "Share name" : "Export path"} value={form.share} onChange={fieldSetter(form, setForm, "share")} /></PanelSectionRow>
          {form.type === "smb" && (
            <>
              <PanelSectionRow><ToggleField label="Guest" checked={!!form.guest} onChange={fieldSetter(form, setForm, "guest")} /></PanelSectionRow>
              {!form.guest && <PanelSectionRow><TextField label="Username" value={form.username || ""} onChange={fieldSetter(form, setForm, "username")} /></PanelSectionRow>}
              {!form.guest && <PanelSectionRow><TextField label="Password" value={form.password || ""} onChange={fieldSetter(form, setForm, "password")} /></PanelSectionRow>}
              <PanelSectionRow><TextField label="Domain optional" value={form.domain || ""} onChange={fieldSetter(form, setForm, "domain")} /></PanelSectionRow>
              <PanelSectionRow><TextField label="SMB version" value={form.version || "3.0"} onChange={fieldSetter(form, setForm, "version")} /></PanelSectionRow>
            </>
          )}
          <PanelSectionRow><TextField label="Extra mount options" value={form.mountOptions || ""} onChange={fieldSetter(form, setForm, "mountOptions")} /></PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={async () => {
              try {
                const saved = await saveShare(form);
                toaster.toast({ title: "Network Shares", body: `Saved ${saved.name}` });
                setForm(emptyShare);
                setShowAdd(false);
                setSelected(saved.name);
                await refresh();
              } catch (e: any) {
                toaster.toast({ title: "Save failed", body: e?.message ?? String(e) });
              }
            }}>Save Share</ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      )}

      {selectedShare && (
        <PanelSection title={`Browse ${selectedShare.name}${path ? `/${path}` : ""}`}>
          {path && (
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={() => {
                const parent = path.split("/").slice(0, -1).join("/");
                browse(selectedShare.name, parent);
              }}>.. Parent Folder</ButtonItem>
            </PanelSectionRow>
          )}
          {items.length === 0 && <PanelSectionRow><div>No files displayed.</div></PanelSectionRow>}
          {items.map((item) => (
            <PanelSectionRow key={item.relativePath}>
              {item.isDir ? (
                <ButtonItem layout="below" onClick={() => browse(selectedShare.name, item.relativePath)}>📁 {item.name}</ButtonItem>
              ) : (
                <div>📄 {item.name} <span style={{ opacity: 0.7 }}>{sizeText(item.size)}</span></div>
              )}
            </PanelSectionRow>
          ))}
        </PanelSection>
      )}
    </div>
  );
}

export default definePlugin(() => ({
  name: "Network Shares",
  titleView: <div className={staticClasses.Title}>Network Shares</div>,
  content: <Content />,
  icon: <FaNetworkWired />,
}));
