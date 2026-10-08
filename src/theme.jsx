import { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";

export const THEMES = [
  { id: "industrial", name: "Industrial Dark", bg: "#0B0C0D", surf: "#151719", tx: "#F1F0EA", mut: "#92969A", ac: "#D78B3D", ink: "#0B0C0D", veil: "rgba(11,12,13,0)" },
  { id: "concrete", name: "Concrete Editorial", light: true, bg: "#F2F0EB", surf: "#E5E1D8", tx: "#151515", mut: "#77736C", ac: "#B85C32", ink: "#F2F0EB", veil: "rgba(242,240,235,.55)" },
  { id: "luxury", name: "Luxury Bronze", bg: "#171613", surf: "#25231E", tx: "#F5F1E8", mut: "#A7A095", ac: "#C9A66B", ink: "#171613", veil: "rgba(23,22,19,0)" },
  { id: "blueprint", name: "Blueprint", bg: "#0A1626", surf: "#10223A", tx: "#E8F0FA", mut: "#8CA3BF", ac: "#5CC8FF", ink: "#06101C", veil: "rgba(10,22,38,0)" },
  { id: "moss", name: "Site Moss", bg: "#0D120F", surf: "#151D18", tx: "#EEF1E6", mut: "#8E9A8C", ac: "#B7C95A", ink: "#0D120F", veil: "rgba(13,18,15,0)" },
  { id: "terracotta", name: "Terracotta Sand", light: true, bg: "#EFE6DA", surf: "#E2D5C3", tx: "#1C1612", mut: "#7A6A5A", ac: "#A8442A", ink: "#EFE6DA", veil: "rgba(239,230,218,.55)" },
];
const KEYS = ["bg", "surf", "tx", "mut", "ac", "ink", "veil"];
const Ctx = createContext(null);
export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }) {
  const [id, setId] = useState(() => { try { return localStorage.getItem("cs-theme") || "industrial"; } catch { return "industrial"; } });
  const theme = THEMES.find((t) => t.id === id) || THEMES[0];
  useLayoutEffect(() => {
    const el = document.documentElement;
    KEYS.forEach((k) => el.style.setProperty("--" + k, theme[k]));
    el.dataset.theme = theme.id; el.style.colorScheme = theme.light ? "light" : "dark";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.bg);
    try { localStorage.setItem("cs-theme", theme.id); } catch {}
  }, [theme]);
  const value = useMemo(() => ({ theme, setTheme: setId, themes: THEMES }), [theme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
