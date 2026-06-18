let r;
var f = (e) => {
    if (!r) {
        const t = ({size: o = 24, ...l}, n) => {
            return e.createElement("svg", {viewBox: "0 0 20 20", fill: "currentColor", width: o, height: o, ref: n, ...l}, e.createElement("path", {fillRule: "evenodd", d: "M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z", clipRule: "evenodd"}));
        };
        r = e.forwardRef(t);
    }
    return r;
};
const __FramerMetadata__ = {exports: {default: {type: "reactComponent", slots: [], annotations: {framerContractVersion: "1"}}, __FramerMetadata__: {type: "variable"}}};
export { __FramerMetadata__, f as default };