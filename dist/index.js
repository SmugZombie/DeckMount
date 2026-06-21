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
function fieldSetter(form, setForm, key) {
    return (value) => setForm({ ...form, [key]: value });
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
function Content() {
    const [shares, setShares] = SP_REACT.useState([]);
    const [form, setForm] = SP_REACT.useState(emptyShare);
    const [selected, setSelected] = SP_REACT.useState("");
    const [path, setPath] = SP_REACT.useState("");
    const [items, setItems] = SP_REACT.useState([]);
    const [status, setStatus] = SP_REACT.useState("Loading...");
    const [showAdd, setShowAdd] = SP_REACT.useState(false);
    const [helperStatus, setHelperStatus] = SP_REACT.useState("");
    const refresh = async () => {
        try {
            const h = await health();
            setHelperStatus(`root=${h.isRoot ? "yes" : "no"}, SMB=${h.hasMountCifs ? "yes" : "missing"}, NFS=${h.hasMountNfs ? "yes" : "missing"}`);
            const list = await getShares();
            setShares(list);
            if (!selected && list.length > 0)
                setSelected(list[0].name);
            setStatus(list.length ? "Ready" : "Add a share to get started");
        }
        catch (e) {
            setStatus(`Error: ${e?.message ?? e}`);
        }
    };
    const browse = async (shareName = selected, nextPath = path) => {
        if (!shareName)
            return;
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
    SP_REACT.useEffect(() => {
        refresh();
    }, []);
    const selectedShare = shares.find((s) => s.name === selected);
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs(DFL.PanelSection, { title: "Network Shares", children: [SP_JSX.jsxs(DFL.PanelSectionRow, { children: [SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "Status" }), SP_JSX.jsx("div", { children: status }), SP_JSX.jsx("div", { style: { opacity: 0.75, fontSize: "12px" }, children: helperStatus })] }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: refresh, children: "Refresh" }) }), shares.length > 0 && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Share", selectedOption: selected, rgOptions: shares.map((s) => ({ data: s.name, label: `${s.name} ${s.mounted ? "●" : "○"}` })), onChange: (opt) => {
                                setSelected(opt.data);
                                setPath("");
                                setItems([]);
                            } }) })), selectedShare && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSectionRow, { children: [SP_JSX.jsxs("div", { children: [selectedShare.type.toUpperCase(), " ", selectedShare.host, "/", selectedShare.share] }), SP_JSX.jsx("div", { style: { opacity: 0.75 }, children: selectedShare.mountpoint })] }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: async () => {
                                        const res = selectedShare.mounted ? await unmountShare(selectedShare.name) : await mountShare(selectedShare.name);
                                        toaster.toast({ title: "Network Shares", body: res.ok ? (selectedShare.mounted ? "Unmounted" : "Mounted") : (res.stderr || res.hint || "Mount failed") });
                                        await refresh();
                                    }, children: selectedShare.mounted ? "Unmount" : "Mount" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => browse(selectedShare.name, ""), children: "Browse Root" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: async () => {
                                        const res = await deleteShare(selectedShare.name);
                                        toaster.toast({ title: "Network Shares", body: res.ok ? "Deleted" : (res.stderr || "Delete failed") });
                                        setSelected("");
                                        setItems([]);
                                        setPath("");
                                        await refresh();
                                    }, children: "Delete Share" }) })] })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => setShowAdd(!showAdd), children: showAdd ? "Hide Add Share" : "Add Share" }) })] }), showAdd && (SP_JSX.jsxs(DFL.PanelSection, { title: "Add / Replace Share", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Name", value: form.name, onChange: fieldSetter(form, setForm, "name") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "Type", selectedOption: form.type, rgOptions: [{ data: "smb", label: "SMB / CIFS" }, { data: "nfs", label: "NFS" }], onChange: (opt) => setForm({ ...form, type: opt.data }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Host/IP", value: form.host, onChange: fieldSetter(form, setForm, "host") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: form.type === "smb" ? "Share name" : "Export path", value: form.share, onChange: fieldSetter(form, setForm, "share") }) }), form.type === "smb" && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "Guest", checked: !!form.guest, onChange: fieldSetter(form, setForm, "guest") }) }), !form.guest && SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Username", value: form.username || "", onChange: fieldSetter(form, setForm, "username") }) }), !form.guest && SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Password", value: form.password || "", onChange: fieldSetter(form, setForm, "password") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Domain optional", value: form.domain || "", onChange: fieldSetter(form, setForm, "domain") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "SMB version", value: form.version || "3.0", onChange: fieldSetter(form, setForm, "version") }) })] })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "Extra mount options", value: form.mountOptions || "", onChange: fieldSetter(form, setForm, "mountOptions") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: async () => {
                                try {
                                    const saved = await saveShare(form);
                                    toaster.toast({ title: "Network Shares", body: `Saved ${saved.name}` });
                                    setForm(emptyShare);
                                    setShowAdd(false);
                                    setSelected(saved.name);
                                    await refresh();
                                }
                                catch (e) {
                                    toaster.toast({ title: "Save failed", body: e?.message ?? String(e) });
                                }
                            }, children: "Save Share" }) })] })), selectedShare && (SP_JSX.jsxs(DFL.PanelSection, { title: `Browse ${selectedShare.name}${path ? `/${path}` : ""}`, children: [path && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => {
                                const parent = path.split("/").slice(0, -1).join("/");
                                browse(selectedShare.name, parent);
                            }, children: ".. Parent Folder" }) })), items.length === 0 && SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { children: "No files displayed." }) }), items.map((item) => (SP_JSX.jsx(DFL.PanelSectionRow, { children: item.isDir ? (SP_JSX.jsxs(DFL.ButtonItem, { layout: "below", onClick: () => browse(selectedShare.name, item.relativePath), children: ["\uD83D\uDCC1 ", item.name] })) : (SP_JSX.jsxs("div", { children: ["\uD83D\uDCC4 ", item.name, " ", SP_JSX.jsx("span", { style: { opacity: 0.7 }, children: sizeText(item.size) })] })) }, item.relativePath)))] }))] }));
}
var index = definePlugin(() => ({
    name: "Network Shares",
    titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "Network Shares" }),
    content: SP_JSX.jsx(Content, {}),
    icon: SP_JSX.jsx(FaNetworkWired, {}),
}));

export { index as default };
//# sourceMappingURL=index.js.map
