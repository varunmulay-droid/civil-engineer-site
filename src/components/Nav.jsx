import { useEffect, useState } from "react";
export default function Nav() {
  const [menu, setMenu] = useState(false), [hide, setHide] = useState(false);
  useEffect(() => {
    let y = 0; const f = () => { const n = scrollY; setHide(n > y && n > 200); y = n; };
    addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f);
  }, []);
  return (
    <header className={"nav" + (hide && !menu ? " hide" : "")}>
      <a href="#top" className="logo">SAHYADRI<b>/</b>STRUCTURES</a>
      <nav className={menu ? "open" : ""} onClick={() => setMenu(false)}>
        <a href="#build">Build</a><a href="#projects">Projects</a><a href="#materials">Materials</a><a href="#process">Process</a>
        <a href="#contact" className="cta sm">Start a project</a>
      </nav>
      <button className="burger" onClick={() => setMenu(!menu)} aria-expanded={menu}>{menu ? "CLOSE" : "MENU"}</button>
    </header>
  );
}
