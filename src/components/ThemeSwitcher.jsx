import { useState } from "react";
import { useTheme } from "../theme.jsx";
export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme(); const [open, setOpen] = useState(false);
  return (
    <div className={"themer" + (open ? " open" : "")}>
      <button className="themer-btn mono" aria-expanded={open} onClick={() => setOpen(!open)}><i style={{ "--a": theme.ac, "--b": theme.bg }} />Palette · {theme.name}</button>
      <ul role="list">{themes.map((t) => (
        <li key={t.id}><button aria-pressed={t.id === theme.id} aria-label={t.name} title={t.name} onClick={() => setTheme(t.id)} style={{ "--a": t.ac, "--b": t.bg }}><i /></button></li>
      ))}</ul>
    </div>
  );
}
