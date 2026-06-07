"use client";

import { motion } from "framer-motion";

export function DcOutputSource() {
  return (
    <>
      <line x1="956" y1="112" x2="1537" y2="112" stroke="black" strokeWidth="5" />
      <circle cx="1104" cy="112" r="12" fill="black" />
      <line x1="1537" y1="112" x2="1537" y2="480" stroke="black" strokeWidth="5" />
      <line x1="1503" y1="319" x2="1561" y2="319" stroke="black" strokeWidth="9" />
      <line x1="1514" y1="346" x2="1550" y2="346" stroke="black" strokeWidth="6" />
      <text x="1568" y="301" fontSize="46" fontFamily="Arial">+</text>
      <text x="1571" y="412" fontSize="46" fontFamily="Arial">-</text>
    </>
  );
}

export function AcOutputSource() {
  return (
    <>
      <line x1="956" y1="112" x2="1330" y2="112" stroke="black" strokeWidth="5" />
      <circle cx="1104" cy="112" r="12" fill="black" />

      <circle cx="1465" cy="292" r="78" fill="#ffffff" stroke="black" strokeWidth="5" />
      <path
        d="M1408 292 C1422 260,1442 260,1456 292 C1470 324,1490 324,1508 292"
        fill="none"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <text x="1390" y="178" fontSize="44" fontFamily="Arial">AC Source</text>

      <line x1="1330" y1="112" x2="1465" y2="112" stroke="black" strokeWidth="5" />
      <line x1="1465" y1="112" x2="1465" y2="214" stroke="black" strokeWidth="5" />
      <line x1="1465" y1="370" x2="1465" y2="472" stroke="black" strokeWidth="5" />
    </>
  );
}

export function DcLoadNetwork({ active }: { active: boolean }) {
  return (
    <>
      <line x1="959" y1="472" x2="1289" y2="472" stroke="black" strokeWidth="5" />
      <circle cx="1104" cy="472" r="12" fill="black" />

      <motion.circle
        cx="1328"
        cy="472"
        r="66"
        fill="#facc15"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? [0.08, 0.28, 0.08] : 0 }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />
      <polygon
        points="1290,434 1290,510 1355,472"
        fill={active ? "#fde68a" : "none"}
        stroke="black"
        strokeWidth="6"
      />
      <line x1="1362" y1="429" x2="1362" y2="515" stroke="black" strokeWidth="6" />
      <line x1="1362" y1="472" x2="1537" y2="472" stroke="black" strokeWidth="5" />
      <motion.g
        animate={{ opacity: active ? [0.35, 1, 0.35] : 0.25 }}
        transition={{ duration: 1.1, repeat: Infinity }}
      >
        <line x1="1378" y1="434" x2="1400" y2="408" stroke="black" strokeWidth="5" />
        <polygon points="1395,405 1412,403 1404,418" fill="black" />
        <line x1="1403" y1="447" x2="1435" y2="448" stroke="black" strokeWidth="5" />
        <polygon points="1428,440 1445,448 1428,456" fill="black" />
      </motion.g>
    </>
  );
}

export function AcLoadNetwork({ active }: { active: boolean }) {
  return (
    <>
      <line x1="959" y1="472" x2="1240" y2="472" stroke="black" strokeWidth="5" />
      <circle cx="1104" cy="472" r="12" fill="black" />

      <motion.rect
        x="1228"
        y="408"
        width="144"
        height="124"
        rx="18"
        fill="#facc15"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? [0.08, 0.32, 0.08] : 0 }}
        transition={{ duration: 1.15, repeat: Infinity }}
      />
      <rect
        x="1240"
        y="420"
        width="120"
        height="100"
        fill={active ? "#fef3c7" : "none"}
        stroke="black"
        strokeWidth="6"
        rx="10"
      />
      <text x="1274" y="478" fontSize="34" fontFamily="Arial">LOAD</text>
      <line x1="1360" y1="472" x2="1465" y2="472" stroke="black" strokeWidth="5" />
    </>
  );
}
