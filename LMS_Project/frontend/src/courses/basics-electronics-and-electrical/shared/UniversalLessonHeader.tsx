"use client";

import Link from "next/link";

type HeaderTab<T extends string> = {
  id: T;
  label: string;
};

type HeaderNavItem = {
  href: string;
  label: string;
};

const defaultNavItems: HeaderNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/courses/basics-electronics-and-electrical", label: "My Course" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function UniversalLessonHeader<T extends string>({
  lessonLabel,
  tabs,
  activeTab,
  onTabChange,
  navItems = defaultNavItems,
}: {
  lessonLabel: string;
  tabs: HeaderTab<T>[];
  activeTab: T;
  onTabChange?: (tabId: T) => void;
  navItems?: HeaderNavItem[];
}) {
  return (
    <section
      style={{
        borderRadius: 32,
        border: "1px solid #dbe4ee",
        background: "#ffffff",
        boxShadow: "0 16px 36px rgba(15,23,42,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "22px 18px 22px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 48,
                borderRadius: 9999,
                border: "1px solid #9ef3c4",
                background: "#ecfdf5",
                padding: "12px 20px",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#047857",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 9999,
                  background: "#10b981",
                  boxShadow: "0 0 0 3px rgba(16,185,129,0.14)",
                }}
              />
              {lessonLabel}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "12px 18px",
                  borderRadius: 16,
                  border: "1px solid #d6dee8",
                  background: "#ffffff",
                  color: "#142033",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 6px 14px rgba(15,23,42,0.05)",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={onTabChange ? () => onTabChange(tab.id) : undefined}
                disabled={!onTabChange}
                style={{
                  minHeight: 44,
                  padding: "10px 18px",
                  borderRadius: 16,
                  border: active ? "1px solid #d6dee8" : "1px solid transparent",
                  background: active ? "#ffffff" : "transparent",
                  color: "#111827",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: onTabChange ? "pointer" : "default",
                  boxShadow: active ? "0 6px 14px rgba(15,23,42,0.06)" : "none",
                  opacity: 1,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
