const manifest = {"name":"Network Shares"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaNetworkWired (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M640 264v-16c0-8.84-7.16-16-16-16H344v-40h72c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32H224c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h72v40H16c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h104v40H64c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h304v40h-56c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h104c8.84 0 16-7.16 16-16zM256 128V64h128v64H256zm-64 320H96v-64h96v64zm352 0h-96v-64h96v64z"},"child":[]}]})(props);
}

const getShares = callable("get_shares");
const saveShare = callable("save_share");
const deleteShare = callable("delete_share");
const mountShare = callable("mount_share");
const unmountShare = callable("unmount_share");
const browseShare = callable("browse");
const health = callable("health");
const emptyShare = {
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
function textFieldSetter(setForm, key) {
    return (event) => {
        const value = event?.target?.value ?? (typeof event === "string" ? event : "");
        setForm((current) => ({ ...current, [key]: value }));
    };
}
function valueSetter(setForm, key) {
    return (value) => setForm((current) => ({ ...current, [key]: value }));
}
function sizeText(bytes) {
    if (!bytes)
        return "";
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
function ShareForm({ form, setForm, onSave, onCancel, }) {
    return (SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [SP_JSX.jsx(DFL.TextField, { label: "Name", value: form.name, onChange: textFieldSetter(setForm, "name") }), SP_JSX.jsx(DFL.DropdownItem, { label: "Type", selectedOption: form.type, rgOptions: [
                    { data: "smb", label: "SMB / CIFS" },
                    { data: "nfs", label: "NFS" },
                ], onChange: (opt) => setForm((f) => ({ ...f, type: opt.data })) }), SP_JSX.jsx(DFL.TextField, { label: "Host / IP", value: form.host, onChange: textFieldSetter(setForm, "host") }), SP_JSX.jsx(DFL.TextField, { label: form.type === "smb" ? "Share name" : "Export path", value: form.share, onChange: textFieldSetter(setForm, "share") }), form.type === "smb" && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.ToggleField, { label: "Guest access", checked: !!form.guest, onChange: valueSetter(setForm, "guest") }), !form.guest && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.TextField, { label: "Username", value: form.username || "", onChange: textFieldSetter(setForm, "username") }), SP_JSX.jsx(DFL.TextField, { label: "Password", value: form.password || "", onChange: textFieldSetter(setForm, "password") })] })), SP_JSX.jsx(DFL.TextField, { label: "Domain (optional)", value: form.domain || "", onChange: textFieldSetter(setForm, "domain") }), SP_JSX.jsx(DFL.TextField, { label: "SMB version", value: form.version || "3.0", onChange: textFieldSetter(setForm, "version") })] })), SP_JSX.jsx(DFL.TextField, { label: "Extra mount options", value: form.mountOptions || "", onChange: textFieldSetter(setForm, "mountOptions") }), SP_JSX.jsxs("div", { style: { display: "flex", gap: "8px", marginTop: "4px" }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { flex: 1 }, onClick: onSave, children: "Save" }), SP_JSX.jsx(DFL.DialogButton, { style: { flex: 1, opacity: 0.7 }, onClick: onCancel, children: "Cancel" })] })] }));
}
// ─── Manager Modal ─────────────────────────────────────────────────────────────
function ManagerModal({ closeModal, startTab }) {
    const [tab, setTab] = SP_REACT.useState(startTab ?? "shares");
    const [shares, setShares] = SP_REACT.useState([]);
    const [form, setForm] = SP_REACT.useState(emptyShare);
    const [showForm, setShowForm] = SP_REACT.useState(false);
    const [editingName, setEditingName] = SP_REACT.useState(null);
    // browse state
    const [browseShare_, setBrowseShare] = SP_REACT.useState("");
    const [path, setPath] = SP_REACT.useState("");
    const [items, setItems] = SP_REACT.useState([]);
    const [browseMsg, setBrowseMsg] = SP_REACT.useState("");
    const refresh = async () => {
        const list = await getShares();
        setShares(list);
        if (!browseShare_ && list.length > 0)
            setBrowseShare(list[0].name);
    };
    SP_REACT.useEffect(() => {
        refresh();
    }, []);
    const browse = async (shareName = browseShare_, nextPath = path) => {
        if (!shareName)
            return;
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
        }
        catch (e) {
            toaster.toast({ title: "Save failed", body: e?.message ?? String(e) });
        }
    };
    const handleDelete = async (name) => {
        const res = await deleteShare(name);
        toaster.toast({ title: "Network Shares", body: res.ok ? `Deleted ${name}` : res.stderr || "Delete failed" });
        await refresh();
    };
    const handleMountToggle = async (share) => {
        const res = share.mounted ? await unmountShare(share.name) : await mountShare(share.name);
        toaster.toast({
            title: "Network Shares",
            body: res.ok ? (share.mounted ? `Unmounted ${share.name}` : `Mounted ${share.name}`) : res.stderr || res.hint || "Failed",
        });
        await refresh();
    };
    const tabBtn = (label, value) => (SP_JSX.jsx(DFL.DialogButton, { onClick: () => setTab(value), style: {
            flex: 1,
            fontWeight: tab === value ? "bold" : "normal",
            opacity: tab === value ? 1 : 0.55,
            borderBottom: tab === value ? "2px solid #1a9fff" : "2px solid transparent",
        }, children: label }));
    return (SP_JSX.jsxs(DFL.ModalRoot, { onCancel: closeModal, children: [SP_JSX.jsx(DFL.DialogHeader, { children: "Network Shares Manager" }), SP_JSX.jsx(DFL.DialogBody, { children: SP_JSX.jsxs(DFL.Focusable, { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [SP_JSX.jsxs("div", { style: { display: "flex", gap: "8px" }, children: [tabBtn("Manage Shares", "shares"), tabBtn("Browse Files", "browse")] }), tab === "shares" && (SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [shares.length === 0 && (SP_JSX.jsx("div", { style: { opacity: 0.6, textAlign: "center", padding: "12px" }, children: "No shares configured. Add one below." })), shares.map((share) => (SP_JSX.jsxs("div", { style: {
                                        background: "rgba(255,255,255,0.06)",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                    }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [SP_JSX.jsx("span", { style: { fontSize: "18px", color: share.mounted ? "#4caf50" : "#aaa" }, children: share.mounted ? "●" : "○" }), SP_JSX.jsxs("div", { style: { flex: 1 }, children: [SP_JSX.jsx("div", { style: { fontWeight: "bold" }, children: share.name }), SP_JSX.jsxs("div", { style: { opacity: 0.65, fontSize: "12px" }, children: [share.type.toUpperCase(), " \u00B7 ", share.host, "/", share.share] }), share.mountpoint && (SP_JSX.jsx("div", { style: { opacity: 0.5, fontSize: "11px" }, children: share.mountpoint }))] })] }), SP_JSX.jsxs("div", { style: { display: "flex", gap: "6px" }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { flex: 1 }, onClick: () => handleMountToggle(share), children: share.mounted ? "Unmount" : "Mount" }), SP_JSX.jsx(DFL.DialogButton, { style: { flex: 1 }, onClick: () => {
                                                        setForm({ ...share, password: "" });
                                                        setEditingName(share.name);
                                                        setShowForm(true);
                                                    }, children: "Edit" }), SP_JSX.jsx(DFL.DialogButton, { style: { flex: 1, opacity: 0.7 }, onClick: () => handleDelete(share.name), children: "Delete" })] })] }, share.name))), !showForm && (SP_JSX.jsx(DFL.DialogButton, { onClick: () => {
                                        setForm({ ...emptyShare });
                                        setEditingName(null);
                                        setShowForm(true);
                                    }, children: "+ Add Share" })), showForm && (SP_JSX.jsxs("div", { style: {
                                        background: "rgba(255,255,255,0.06)",
                                        borderRadius: "8px",
                                        padding: "12px",
                                    }, children: [SP_JSX.jsx("div", { style: { fontWeight: "bold", marginBottom: "10px" }, children: editingName ? `Edit: ${editingName}` : "New Share" }), SP_JSX.jsx(ShareForm, { form: form, setForm: setForm, onSave: handleSave, onCancel: () => {
                                                setShowForm(false);
                                                setEditingName(null);
                                                setForm({ ...emptyShare });
                                            } })] }))] })), tab === "browse" && (SP_JSX.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: shares.length === 0 ? (SP_JSX.jsx("div", { style: { opacity: 0.6, textAlign: "center", padding: "16px" }, children: "No shares configured." })) : (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs("div", { style: { display: "flex", gap: "8px", alignItems: "center" }, children: [SP_JSX.jsx("div", { style: { flex: 1 }, children: SP_JSX.jsx(DFL.DropdownItem, { label: "Share", selectedOption: browseShare_, rgOptions: shares.map((s) => ({
                                                        data: s.name,
                                                        label: `${s.name} ${s.mounted ? "●" : "○"}`,
                                                    })), onChange: (opt) => {
                                                        setBrowseShare(opt.data);
                                                        setPath("");
                                                        setItems([]);
                                                        setBrowseMsg("");
                                                    } }) }), SP_JSX.jsx(DFL.DialogButton, { onClick: () => browse(browseShare_, ""), style: { whiteSpace: "nowrap" }, children: "Browse Root" })] }), browseMsg && (SP_JSX.jsx("div", { style: { opacity: 0.65, fontSize: "12px", overflowWrap: "anywhere" }, children: browseMsg })), path && (SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [SP_JSX.jsx(DFL.DialogButton, { onClick: () => {
                                                    const parent = path.split("/").slice(0, -1).join("/");
                                                    browse(browseShare_, parent);
                                                }, style: { minWidth: "80px" }, children: "\u2190 Back" }), SP_JSX.jsxs("div", { style: {
                                                    flex: 1,
                                                    fontSize: "12px",
                                                    opacity: 0.75,
                                                    overflowWrap: "anywhere",
                                                    wordBreak: "break-all",
                                                }, children: ["/", path] })] })), items.length === 0 && !browseMsg && (SP_JSX.jsx("div", { style: { opacity: 0.5, textAlign: "center", padding: "16px" }, children: "Select a share and press Browse Root." })), SP_JSX.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: items.map((item) => item.isDir ? (SP_JSX.jsxs(DFL.DialogButton, { onClick: () => browse(browseShare_, item.relativePath), style: { textAlign: "left", justifyContent: "flex-start" }, children: ["\uD83D\uDCC1 ", item.name] }, item.relativePath)) : (SP_JSX.jsxs("div", { style: {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "8px 12px",
                                                background: "rgba(255,255,255,0.04)",
                                                borderRadius: "6px",
                                            }, children: [SP_JSX.jsxs("span", { children: ["\uD83D\uDCC4 ", item.name] }), item.size > 0 && (SP_JSX.jsx("span", { style: { opacity: 0.55, fontSize: "12px" }, children: sizeText(item.size) }))] }, item.relativePath))) })] })) }))] }) })] }));
}
// ─── Panel (small view) ────────────────────────────────────────────────────────
function Content() {
    const [shares, setShares] = SP_REACT.useState([]);
    const [status, setStatus] = SP_REACT.useState("Loading…");
    const [helperStatus, setHelperStatus] = SP_REACT.useState("");
    const refresh = async () => {
        try {
            const h = await health();
            setHelperStatus(`root=${h.isRoot ? "yes" : "no"}  SMB=${h.hasMountCifs ? "ok" : "missing"}  NFS=${h.hasMountNfs ? "ok" : "missing"}`);
            const list = await getShares();
            setShares(list);
            setStatus(list.length ? `${list.filter((s) => s.mounted).length}/${list.length} mounted` : "No shares configured");
        }
        catch (e) {
            setStatus(`Error: ${e?.message ?? e}`);
        }
    };
    SP_REACT.useEffect(() => {
        refresh();
    }, []);
    const handleMountToggle = async (share) => {
        const res = share.mounted ? await unmountShare(share.name) : await mountShare(share.name);
        toaster.toast({
            title: "Network Shares",
            body: res.ok ? (share.mounted ? `Unmounted ${share.name}` : `Mounted ${share.name}`) : res.stderr || res.hint || "Failed",
        });
        await refresh();
    };
    return (SP_JSX.jsx("div", { children: SP_JSX.jsxs(DFL.PanelSection, { title: "Network Shares", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "3px", width: "100%" }, children: [SP_JSX.jsx("div", { style: { whiteSpace: "normal", overflowWrap: "anywhere" }, children: status }), !!helperStatus && (SP_JSX.jsx("div", { style: { opacity: 0.6, fontSize: "11px", whiteSpace: "normal", overflowWrap: "anywhere" }, children: helperStatus }))] }) }), shares.map((share) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", width: "100%", gap: "6px" }, children: [SP_JSX.jsx("span", { style: { fontSize: "14px", color: share.mounted ? "#4caf50" : "#888", flexShrink: 0 }, children: share.mounted ? "●" : "○" }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [SP_JSX.jsx("div", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: share.name }), SP_JSX.jsxs("div", { style: { fontSize: "11px", opacity: 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [share.host, "/", share.share] })] }), SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: () => handleMountToggle(share), children: share.mounted ? "Unmount" : "Mount" })] }) }, share.name))), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => DFL.showModal(SP_JSX.jsx(ManagerModal, {}), window), children: "Open Manager" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: refresh, children: "Refresh" }) })] }) }));
}
var index = definePlugin(() => ({
    name: "Network Shares",
    titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "Network Shares" }),
    content: SP_JSX.jsx(Content, {}),
    icon: SP_JSX.jsx(FaNetworkWired, {}),
}));

export { index as default };
//# sourceMappingURL=index.js.map
