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
  DialogButton,
  DialogHeader,
  DialogBody,
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

function textFieldSetter<T extends keyof Share>(setForm: React.Dispatch<React.SetStateAction<Share>>, key: T) {
  return (event: any) => {
    const value = event?.target?.value ?? (typeof event === "string" ? event : "");
    setForm((current) => ({ ...current, [key]: value }));
  };
}

function valueSetter<T extends keyof Share>(setForm: React.Dispatch<React.SetStateAction<Share>>, key: T) {
  return (value: any) => setForm((current) => ({ ...current, [key]: value }));
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

// ─── Share Form ────────────────────────────────────────────────────────────────

function ShareForm({
  form,
  setForm,
  onSave,
  onCancel,
}: {
  form: Share;
  setForm: React.Dispatch<React.SetStateAction<Share>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <TextField label="Name" value={form.name} onChange={textFieldSetter(setForm, "name")} />
      <DropdownItem
        label="Type"
        selectedOption={form.type}
        rgOptions={[
          { data: "smb", label: "SMB / CIFS" },
          { data: "nfs", label: "NFS" },
        ]}
        onChange={(opt: any) => setForm((f) => ({ ...f, type: opt.data }))}
      />
      <TextField label="Host / IP" value={form.host} onChange={textFieldSetter(setForm, "host")} />
      <TextField
        label={form.type === "smb" ? "Share name" : "Export path"}
        value={form.share}
        onChange={textFieldSetter(setForm, "share")}
      />
      {form.type === "smb" && (
        <>
          <ToggleField label="Guest access" checked={!!form.guest} onChange={valueSetter(setForm, "guest")} />
          {!form.guest && (
            <>
              <TextField label="Username" value={form.username || ""} onChange={textFieldSetter(setForm, "username")} />
              <TextField label="Password" value={form.password || ""} onChange={textFieldSetter(setForm, "password")} />
            </>
          )}
          <TextField label="Domain (optional)" value={form.domain || ""} onChange={textFieldSetter(setForm, "domain")} />
          <TextField label="SMB version" value={form.version || "3.0"} onChange={textFieldSetter(setForm, "version")} />
        </>
      )}
      <TextField label="Extra mount options" value={form.mountOptions || ""} onChange={textFieldSetter(setForm, "mountOptions")} />
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        <DialogButton style={{ flex: 1 }} onClick={onSave}>
          Save
        </DialogButton>
        <DialogButton style={{ flex: 1, opacity: 0.7 }} onClick={onCancel}>
          Cancel
        </DialogButton>
      </div>
    </div>
  );
}

// ─── Manager Modal ─────────────────────────────────────────────────────────────

function ManagerModal({ closeModal, startTab }: { closeModal?: () => void; startTab?: "shares" | "browse" }) {
  const [tab, setTab] = useState<"shares" | "browse">(startTab ?? "shares");
  const [shares, setShares] = useState<Share[]>([]);
  const [form, setForm] = useState<Share>(emptyShare);
  const [showForm, setShowForm] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);

  // browse state
  const [browseShare_, setBrowseShare] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [browseMsg, setBrowseMsg] = useState<string>("");

  const refresh = async () => {
    const list = await getShares();
    setShares(list);
    if (!browseShare_ && list.length > 0) setBrowseShare(list[0].name);
  };

  useEffect(() => {
    refresh();
  }, []);

  const browse = async (shareName = browseShare_, nextPath = path) => {
    if (!shareName) return;
    setBrowseMsg("Loading…");
    const res = await browseShare(shareName, nextPath || "");
    if (!res.ok) {
      setItems([]);
      setBrowseMsg(res.error || "Browse failed");
      return;
    }
    setPath(res.path || "");
    setItems(res.items || []);
    setBrowseMsg(res.mountpoint ? `📂 ${res.mountpoint}` : "");
  };

  const handleSave = async () => {
    try {
      const saved = await saveShare(form);
      toaster.toast({ title: "Network Shares", body: `Saved ${saved.name}` });
      setShowForm(false);
      setEditingName(null);
      setForm({ ...emptyShare });
      await refresh();
    } catch (e: any) {
      toaster.toast({ title: "Save failed", body: e?.message ?? String(e) });
    }
  };

  const handleDelete = async (name: string) => {
    const res = await deleteShare(name);
    toaster.toast({ title: "Network Shares", body: res.ok ? `Deleted ${name}` : res.stderr || "Delete failed" });
    await refresh();
  };

  const handleMountToggle = async (share: Share) => {
    const res = share.mounted ? await unmountShare(share.name) : await mountShare(share.name);
    toaster.toast({
      title: "Network Shares",
      body: res.ok ? (share.mounted ? `Unmounted ${share.name}` : `Mounted ${share.name}`) : res.stderr || res.hint || "Failed",
    });
    await refresh();
  };

  const tabBtn = (label: string, value: "shares" | "browse") => (
    <DialogButton
      onClick={() => setTab(value)}
      style={{
        flex: 1,
        fontWeight: tab === value ? "bold" : "normal",
        opacity: tab === value ? 1 : 0.55,
        borderBottom: tab === value ? "2px solid #1a9fff" : "2px solid transparent",
      }}
    >
      {label}
    </DialogButton>
  );

  return (
    <ModalRoot onCancel={closeModal}>
      <DialogHeader>Network Shares Manager</DialogHeader>
      <DialogBody>
        <Focusable style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: "8px" }}>
            {tabBtn("Manage Shares", "shares")}
            {tabBtn("Browse Files", "browse")}
          </div>

          {/* ── Manage Shares tab ──────────────────────────────────── */}
          {tab === "shares" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {shares.length === 0 && (
                <div style={{ opacity: 0.6, textAlign: "center", padding: "12px" }}>
                  No shares configured. Add one below.
                </div>
              )}

              {shares.map((share) => (
                <div
                  key={share.name}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px", color: share.mounted ? "#4caf50" : "#aaa" }}>
                      {share.mounted ? "●" : "○"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold" }}>{share.name}</div>
                      <div style={{ opacity: 0.65, fontSize: "12px" }}>
                        {share.type.toUpperCase()} · {share.host}/{share.share}
                      </div>
                      {share.mountpoint && (
                        <div style={{ opacity: 0.5, fontSize: "11px" }}>{share.mountpoint}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <DialogButton style={{ flex: 1 }} onClick={() => handleMountToggle(share)}>
                      {share.mounted ? "Unmount" : "Mount"}
                    </DialogButton>
                    <DialogButton
                      style={{ flex: 1 }}
                      onClick={() => {
                        setForm({ ...share, password: "" });
                        setEditingName(share.name);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </DialogButton>
                    <DialogButton
                      style={{ flex: 1, opacity: 0.7 }}
                      onClick={() => handleDelete(share.name)}
                    >
                      Delete
                    </DialogButton>
                  </div>
                </div>
              ))}

              {!showForm && (
                <DialogButton
                  onClick={() => {
                    setForm({ ...emptyShare });
                    setEditingName(null);
                    setShowForm(true);
                  }}
                >
                  + Add Share
                </DialogButton>
              )}

              {showForm && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    {editingName ? `Edit: ${editingName}` : "New Share"}
                  </div>
                  <ShareForm
                    form={form}
                    setForm={setForm}
                    onSave={handleSave}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingName(null);
                      setForm({ ...emptyShare });
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Browse Files tab ──────────────────────────────────── */}
          {tab === "browse" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {shares.length === 0 ? (
                <div style={{ opacity: 0.6, textAlign: "center", padding: "16px" }}>
                  No shares configured.
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <DropdownItem
                        label="Share"
                        selectedOption={browseShare_}
                        rgOptions={shares.map((s) => ({
                          data: s.name,
                          label: `${s.name} ${s.mounted ? "●" : "○"}`,
                        }))}
                        onChange={(opt: any) => {
                          setBrowseShare(opt.data);
                          setPath("");
                          setItems([]);
                          setBrowseMsg("");
                        }}
                      />
                    </div>
                    <DialogButton
                      onClick={() => browse(browseShare_, "")}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Browse Root
                    </DialogButton>
                  </div>

                  {browseMsg && (
                    <div style={{ opacity: 0.65, fontSize: "12px", overflowWrap: "anywhere" }}>
                      {browseMsg}
                    </div>
                  )}

                  {path && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <DialogButton
                        onClick={() => {
                          const parent = path.split("/").slice(0, -1).join("/");
                          browse(browseShare_, parent);
                        }}
                        style={{ minWidth: "80px" }}
                      >
                        ← Back
                      </DialogButton>
                      <div
                        style={{
                          flex: 1,
                          fontSize: "12px",
                          opacity: 0.75,
                          overflowWrap: "anywhere",
                          wordBreak: "break-all",
                        }}
                      >
                        /{path}
                      </div>
                    </div>
                  )}

                  {items.length === 0 && !browseMsg && (
                    <div style={{ opacity: 0.5, textAlign: "center", padding: "16px" }}>
                      Select a share and press Browse Root.
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {items.map((item) =>
                      item.isDir ? (
                        <DialogButton
                          key={item.relativePath}
                          onClick={() => browse(browseShare_, item.relativePath)}
                          style={{ textAlign: "left", justifyContent: "flex-start" }}
                        >
                          📁 {item.name}
                        </DialogButton>
                      ) : (
                        <div
                          key={item.relativePath}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: "6px",
                          }}
                        >
                          <span>📄 {item.name}</span>
                          {item.size > 0 && (
                            <span style={{ opacity: 0.55, fontSize: "12px" }}>{sizeText(item.size)}</span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </Focusable>
      </DialogBody>
    </ModalRoot>
  );
}

// ─── Panel (small view) ────────────────────────────────────────────────────────

function Content() {
  const [shares, setShares] = useState<Share[]>([]);
  const [status, setStatus] = useState<string>("Loading…");
  const [helperStatus, setHelperStatus] = useState<string>("");

  const refresh = async () => {
    try {
      const h = await health();
      setHelperStatus(
        `root=${h.isRoot ? "yes" : "no"}  SMB=${h.hasMountCifs ? "ok" : "missing"}  NFS=${h.hasMountNfs ? "ok" : "missing"}`
      );
      const list = await getShares();
      setShares(list);
      setStatus(list.length ? `${list.filter((s) => s.mounted).length}/${list.length} mounted` : "No shares configured");
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? e}`);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleMountToggle = async (share: Share) => {
    const res = share.mounted ? await unmountShare(share.name) : await mountShare(share.name);
    toaster.toast({
      title: "Network Shares",
      body: res.ok ? (share.mounted ? `Unmounted ${share.name}` : `Mounted ${share.name}`) : res.stderr || res.hint || "Failed",
    });
    await refresh();
  };

  return (
    <div>
      <PanelSection title="Network Shares">
        <PanelSectionRow>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "100%" }}>
            <div style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{status}</div>
            {!!helperStatus && (
              <div style={{ opacity: 0.6, fontSize: "11px", whiteSpace: "normal", overflowWrap: "anywhere" }}>
                {helperStatus}
              </div>
            )}
          </div>
        </PanelSectionRow>

        {shares.map((share) => (
          <PanelSectionRow key={share.name}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "6px" }}>
              <span style={{ fontSize: "14px", color: share.mounted ? "#4caf50" : "#888", flexShrink: 0 }}>
                {share.mounted ? "●" : "○"}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {share.name}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {share.host}/{share.share}
                </div>
              </div>
              <ButtonItem
                layout="inline"
                onClick={() => handleMountToggle(share)}
                style={{ flexShrink: 0, minWidth: "80px" }}
              >
                {share.mounted ? "Unmount" : "Mount"}
              </ButtonItem>
            </div>
          </PanelSectionRow>
        ))}

        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => showModal(<ManagerModal />, window)}
          >
            Open Manager
          </ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={refresh}>
            Refresh
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
}

export default definePlugin(() => ({
  name: "Network Shares",
  titleView: <div className={staticClasses.Title}>Network Shares</div>,
  content: <Content />,
  icon: <FaNetworkWired />,
}));
