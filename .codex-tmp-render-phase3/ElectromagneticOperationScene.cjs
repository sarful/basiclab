"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ElectromagneticOperationScene;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const steps = [
    { key: "idle", title: "Idle", note: "Coil OFF, spring normal, NO contacts open." },
    { key: "coil-energized", title: "Coil Energized", note: "Voltage applied to A1 and A2." },
    { key: "magnetic-field", title: "Magnetic Field", note: "Coil creates magnetic flux around core." },
    { key: "armature-moving", title: "Armature Pulled", note: "Armature moves toward the iron core." },
    { key: "spring-compressed", title: "Spring Compressed", note: "Return spring stores mechanical force." },
    { key: "contacts-closed", title: "Contacts Closed", note: "Main NO contacts close." },
    { key: "power-flowing", title: "Power Flowing", note: "Current flows through contactor to load." },
];
function ElectromagneticOperationScene() {
    const [stepIndex, setStepIndex] = (0, react_1.useState)(0);
    const [autoPlay, setAutoPlay] = (0, react_1.useState)(false);
    const current = steps[stepIndex];
    const energized = stepIndex >= 1;
    const fieldVisible = stepIndex >= 2;
    const armaturePulled = stepIndex >= 3;
    const springCompressed = stepIndex >= 4;
    const contactsClosed = stepIndex >= 5;
    const powerFlowing = stepIndex >= 6;
    (0, react_1.useEffect)(() => {
        if (!autoPlay)
            return;
        const timer = setInterval(() => {
            setStepIndex((prev) => (prev >= steps.length - 1 ? 0 : prev + 1));
        }, 1200);
        return () => clearInterval(timer);
    }, [autoPlay]);
    const statusText = (0, react_1.useMemo)(() => {
        if (powerFlowing)
            return "Load Running";
        if (contactsClosed)
            return "Contacts Closed";
        if (springCompressed)
            return "Spring Compressed";
        if (armaturePulled)
            return "Armature Pulled";
        if (fieldVisible)
            return "Magnetic Field Active";
        if (energized)
            return "Coil Energized";
        return "Contactor OFF";
    }, [energized, fieldVisible, armaturePulled, springCompressed, contactsClosed, powerFlowing]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen w-full bg-slate-100 p-6 text-slate-800", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold", children: "Electromagnetic Operation Scene" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500", children: "Magnetic contactor operation: coil \u2192 magnetic field \u2192 armature \u2192 spring \u2192 contacts." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-2xl bg-slate-900 px-5 py-3 text-white", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-300", children: "Current State" }), (0, jsx_runtime_1.jsx)("p", { className: "font-semibold", children: statusText })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-6 lg:grid-cols-[1fr_330px]", children: [(0, jsx_runtime_1.jsx)("div", { className: "rounded-3xl border bg-slate-50 p-4", children: (0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 920 540", className: "h-auto w-full", children: [(0, jsx_runtime_1.jsxs)("defs", { children: [(0, jsx_runtime_1.jsxs)("filter", { id: "blueGlow", children: [(0, jsx_runtime_1.jsx)("feGaussianBlur", { stdDeviation: "5", result: "blur" }), (0, jsx_runtime_1.jsxs)("feMerge", { children: [(0, jsx_runtime_1.jsx)("feMergeNode", { in: "blur" }), (0, jsx_runtime_1.jsx)("feMergeNode", { in: "SourceGraphic" })] })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: "metal", x1: "0", x2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "#64748b" }), (0, jsx_runtime_1.jsx)("stop", { offset: "50%", stopColor: "#e2e8f0" }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "#475569" })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: "coil", x1: "0", x2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "#b45309" }), (0, jsx_runtime_1.jsx)("stop", { offset: "50%", stopColor: "#facc15" }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "#92400e" })] })] }), (0, jsx_runtime_1.jsx)("rect", { x: "90", y: "70", width: "690", height: "390", rx: "30", fill: "#1e293b" }), (0, jsx_runtime_1.jsx)("rect", { x: "120", y: "100", width: "630", height: "330", rx: "22", fill: "#334155" }), (0, jsx_runtime_1.jsx)("rect", { x: "175", y: "195", width: "220", height: "130", rx: "18", fill: energized ? "#fef3c7" : "#64748b", opacity: energized ? 1 : 0.55 }), Array.from({ length: 18 }).map((_, i) => ((0, jsx_runtime_1.jsx)("path", { d: `M ${195 + i * 10} 210 Q ${205 + i * 10} 260 ${195 + i * 10} 310`, fill: "none", stroke: energized ? "url(#coil)" : "#94a3b8", strokeWidth: "5", strokeLinecap: "round" }, i))), (0, jsx_runtime_1.jsx)("text", { x: "225", y: "355", fill: "#e2e8f0", fontSize: "18", fontWeight: "700", children: "Coil A1-A2" }), (0, jsx_runtime_1.jsx)("rect", { x: "420", y: "160", width: "58", height: "205", rx: "8", fill: "url(#metal)" }), (0, jsx_runtime_1.jsx)("text", { x: "400", y: "395", fill: "#e2e8f0", fontSize: "18", fontWeight: "700", children: "Iron Core" }), fieldVisible &&
                                        [0, 1, 2, 3].map((i) => ((0, jsx_runtime_1.jsx)("ellipse", { cx: "450", cy: "263", rx: 95 + i * 28, ry: 58 + i * 18, fill: "none", stroke: "#38bdf8", strokeWidth: "3", opacity: 0.8 - i * 0.12, filter: "url(#blueGlow)" }, i))), (0, jsx_runtime_1.jsxs)("g", { style: {
                                            transform: armaturePulled ? "translateX(-55px)" : "translateX(0px)",
                                            transition: "transform 500ms ease",
                                        }, children: [(0, jsx_runtime_1.jsx)("rect", { x: "585", y: "210", width: "150", height: "38", rx: "7", fill: "url(#metal)" }), (0, jsx_runtime_1.jsx)("rect", { x: "585", y: "275", width: "150", height: "38", rx: "7", fill: "url(#metal)" }), (0, jsx_runtime_1.jsx)("rect", { x: "720", y: "195", width: "28", height: "135", rx: "6", fill: "#cbd5e1" })] }), (0, jsx_runtime_1.jsx)("text", { x: "585", y: "365", fill: "#e2e8f0", fontSize: "18", fontWeight: "700", children: "Armature" }), (0, jsx_runtime_1.jsx)("path", { d: springCompressed
                                            ? "M775 220 L790 230 L775 240 L790 250 L775 260"
                                            : "M775 195 L805 215 L775 235 L805 255 L775 275 L805 295", fill: "none", stroke: "#fb923c", strokeWidth: "5", strokeLinecap: "round", style: { transition: "all 500ms ease" } }), (0, jsx_runtime_1.jsx)("text", { x: "770", y: "330", fill: "#e2e8f0", fontSize: "16", fontWeight: "700", children: "Spring" }), [0, 1, 2].map((i) => {
                                        const x = 210 + i * 165;
                                        return ((0, jsx_runtime_1.jsxs)("g", { children: [(0, jsx_runtime_1.jsx)("line", { x1: x, y1: "60", x2: x, y2: "135", stroke: "#475569", strokeWidth: "10" }), (0, jsx_runtime_1.jsx)("line", { x1: x, y1: "390", x2: x, y2: "475", stroke: "#475569", strokeWidth: "10" }), (0, jsx_runtime_1.jsx)("circle", { cx: x, cy: "145", r: "13", fill: "#f59e0b" }), (0, jsx_runtime_1.jsx)("circle", { cx: x, cy: "380", r: "13", fill: "#f59e0b" }), (0, jsx_runtime_1.jsx)("line", { x1: x, y1: "165", x2: x, y2: contactsClosed ? 360 : 310, stroke: contactsClosed ? "#22c55e" : "#f97316", strokeWidth: "9", strokeLinecap: "round", style: { transition: "all 500ms ease" } }), (0, jsx_runtime_1.jsxs)("text", { x: x - 18, y: "45", fill: "#334155", fontSize: "17", fontWeight: "800", children: ["L", i + 1] }), (0, jsx_runtime_1.jsxs)("text", { x: x - 18, y: "505", fill: "#334155", fontSize: "17", fontWeight: "800", children: ["T", i + 1] }), powerFlowing && ((0, jsx_runtime_1.jsx)("circle", { r: "8", fill: "#22c55e", filter: "url(#blueGlow)", children: (0, jsx_runtime_1.jsx)("animateMotion", { dur: "1.2s", repeatCount: "indefinite", path: `M ${x} 65 L ${x} 475` }) }))] }, i));
                                    }), (0, jsx_runtime_1.jsx)("circle", { cx: "845", cy: "155", r: "24", fill: energized ? "#22c55e" : "#64748b" }), (0, jsx_runtime_1.jsx)("text", { x: "815", y: "198", fill: "#334155", fontSize: "15", fontWeight: "800", children: "Coil" }), (0, jsx_runtime_1.jsx)("circle", { cx: "845", cy: "255", r: "24", fill: contactsClosed ? "#22c55e" : "#64748b" }), (0, jsx_runtime_1.jsx)("text", { x: "805", y: "298", fill: "#334155", fontSize: "15", fontWeight: "800", children: "Contact" }), (0, jsx_runtime_1.jsx)("circle", { cx: "845", cy: "355", r: "24", fill: powerFlowing ? "#22c55e" : "#64748b" }), (0, jsx_runtime_1.jsx)("text", { x: "815", y: "398", fill: "#334155", fontSize: "15", fontWeight: "800", children: "Load" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border bg-white p-5", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold", children: current.title }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-slate-600", children: current.note }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-5 grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setStepIndex((v) => Math.max(0, v - 1)), className: "rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-300", children: "Previous" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setStepIndex((v) => Math.min(steps.length - 1, v + 1)), className: "rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700", children: "Next" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setAutoPlay((v) => !v), className: "col-span-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800", children: autoPlay ? "Pause Auto Play" : "Start Auto Play" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                                        setAutoPlay(false);
                                                        setStepIndex(0);
                                                    }, className: "col-span-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50", children: "Reset" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border bg-white p-5", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-3 font-bold", children: "Operation Timeline" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: steps.map((step, index) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setStepIndex(index), className: `w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${index === stepIndex
                                                    ? "bg-blue-600 text-white"
                                                    : index < stepIndex
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-slate-100 text-slate-600"}`, children: [index + 1, ". ", step.title] }, step.key))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border bg-amber-50 p-5 text-sm text-amber-900", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Learning Note:" }), " When the coil is energized, it becomes an electromagnet. This magnetic force pulls the armature, compresses the spring, closes NO contacts, and allows power to flow."] })] })] })] }) }));
}
