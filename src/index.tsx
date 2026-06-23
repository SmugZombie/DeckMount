import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  TextField,
  ToggleField,
  DropdownItem,
  staticClasses,
  showModal,
  ModalRoot,
  Focusable,
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

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  gap: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  cursor: "pointer",
  fontSize: "15px",
};

function FileBrowserModal({ shareName, closeModal }: { shareName: string; closeModal?: () => void }) {
  const [path, setPath] = useState("");
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const browse = async (nextPath: string) => {
    setLoading(true);
    setError("");
    const res = await browseShare(shareName, nextPath);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Browse failed");
      return;
    }
    setPath(res.path || "");
    setItems(res.items || []);
  };

  useEffect(() => { browse(""); }, []);

  const goUp = () => browse(path.split("/").slice(0, -1).join("/"));

  return (
    <ModalRoot bAllowFullSize onCancel={closeModal}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>📁 {shareName}</div>
          <div style={{ opacity: 0.55, fontSize: "13px", fontFamily: "monospace", marginTop: 2 }}>
            /{path}
          </div>
        </div>

        <Focusable style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <div style={{ padding: "16px", opacity: 0.6 }}>Loading…</div>
          )}
          {error && (
            <div style={{ padding: "16px", color: "#ff6b6b" }}>{error}</div>
          )}
          {!loading && !error && (
            <>
              {path && (
                <Focusable onActivate={goUp}>
                  <div style={rowStyle} onClick={goUp}>
                    <span style={{ fontSize: "18px" }}>⬆️</span>
                    <span style={{ opacity: 0.8 }}>.. Parent folder</span>
                  </div>
                </Focusable>
              )}
              {items.length === 0 && (
                <div style={{ padding: "16px", opacity: 0.5 }}>Empty folder</div>
              )}
              {items.map((item) => (
                <Focusable
                  key={item.relativePath}
                  onActivate={item.isDir ? () => browse(item.relativePath) : undefined}
                >
                  <div
                    style={{ ...rowStyle, cursor: item.isDir ? "pointer" : "default" }}
                    onClick={item.isDir ? () => browse(item.relativePath) : undefined}
                  >
                    <span style={{ fontSize: "18px" }}>{item.isDir ? "📁" : "📄"}</span>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </span>
                    {!item.isDir && item.size > 0 && (
                      <span style={{ opacity: 0.55, fontSize: "13px", flexShrink: 0 }}>
                        {sizeText(item.size)}
                      </span>
                    )}
                  </div>
                </Focusable>
              ))}
            </>
          )}
        </Focusable>
      </div>
    </ModalRoot>
  );
}

function Content() {
  const [shares, setShares] = useState<Share[]>([]);
  const [form, setForm] = useState<Share>(emptyShare);
  const [selected, setSelected] = useState<string>("");
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
              onChange={(opt: any) => setSelected(opt.data)}
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
              <ButtonItem layout="below" onClick={() => showModal(<FileBrowserModal shareName={selectedShare.name} />)}>Browse</ButtonItem>
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={async () => {
                const res = await deleteShare(selectedShare.name);
                toaster.toast({ title: "Network Shares", body: res.ok ? "Deleted" : (res.stderr || "Delete failed") });
                setSelected("");
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

    </div>
  );
}

export default definePlugin(() => ({
  name: "Network Shares",
  titleView: <div className={staticClasses.Title}>Network Shares</div>,
  content: <Content />,
  icon: <FaNetworkWired />,
}));
