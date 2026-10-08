import { useEffect, useRef } from "react";
import { gsap } from "../motion/easings.js";

// Survey-reticle cursor: crosshair ring + live X/Y readout; snaps to controls with
// corner brackets; turns into a labelled disc over [data-cursor] regions.
export default function Cursor() {
  const root = useRef(), ring = useRef(), dot = useRef(), co = useRef(), label = useRef(), inner = useRef();
  useEffect(() => {
    if (!matchMedia("(pointer:fine)").matches) return;
    const html = document.documentElement; html.classList.add("cur-on");
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const f = rm ? 0 : 1;
    gsap.set([ring.current, dot.current, co.current], { xPercent: -50, yPercent: -50, x: -200, y: -200 });
    const q = (el, p, d, e = "power3") => gsap.quickTo(el, p, { duration: d * f, ease: e });
    const dx = q(dot.current, "x", 0.1), dy = q(dot.current, "y", 0.1);
    const rx = q(ring.current, "x", 0.5, "expo.out"), ry = q(ring.current, "y", 0.5, "expo.out");
    const cx = q(co.current, "x", 0.6), cy = q(co.current, "y", 0.6), rot = q(inner.current, "rotation", 0.9);
    let mode = "idle", el = null, mx = -200, my = -200, spin = 0, raf = 0;
    const R = root.current, size = (w, h) => gsap.to(ring.current, { width: w, height: h, duration: 0.55 * f, ease: "expo.out", overwrite: "auto" });
    const set = (m, target) => {
      R.classList.remove("m-idle", "m-snap", "m-label", "m-text"); R.classList.add("m-" + m);
      mode = m; el = target || null;
      if (m === "idle") size(46, 46);
      if (m === "label") { label.current.textContent = target.dataset.cursor; size(96, 96); }
      if (m === "text") size(46, 46);
      if (m === "snap") { const r = target.getBoundingClientRect(); size(r.width + 16, r.height + 16); rx(r.left + r.width / 2); ry(r.top + r.height / 2); }
    };
    const pick = (t) => {
      const lab = t.closest?.("[data-cursor]"); if (lab) return ["label", lab];
      const tx = t.closest?.("input[type=text],input:not([type]),textarea"); if (tx) return ["text", tx];
      const c = t.closest?.("a,button,input,select,label"); if (c) { const r = c.getBoundingClientRect(); if (r.width < 460 && r.height < 170) return ["snap", c]; }
      return ["idle", null];
    };
    const tick = () => {
      raf = 0;
      co.current.textContent = `X ${String(Math.round(mx)).padStart(4, "0")}  Y ${String(Math.round(my)).padStart(4, "0")}`;
    };
    const move = (e) => {
      mx = e.clientX; my = e.clientY; R.classList.remove("gone");
      dx(mx); dy(my); cx(mx + 34); cy(my + 30);
      if (mode === "snap" && el) { const r = el.getBoundingClientRect(); rx(r.left + r.width / 2 + (mx - (r.left + r.width / 2)) * 0.12); ry(r.top + r.height / 2 + (my - (r.top + r.height / 2)) * 0.12); }
      else { rx(mx); ry(my); }
      spin += e.movementX * 0.35; rot(spin);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const over = (e) => { const [m, t] = pick(e.target); if (m !== mode || t !== el) set(m, t); };
    const down = () => R.classList.add("press"), up = () => R.classList.remove("press");
    const leave = () => R.classList.add("gone");
    const scroll = () => { if (mode === "snap" && el?.isConnected) { const r = el.getBoundingClientRect(); rx(r.left + r.width / 2); ry(r.top + r.height / 2); } };
    set("idle");
    addEventListener("pointermove", move, { passive: true }); document.addEventListener("pointerover", over);
    addEventListener("pointerdown", down); addEventListener("pointerup", up); document.documentElement.addEventListener("mouseleave", leave); addEventListener("scroll", scroll, { passive: true });
    return () => {
      html.classList.remove("cur-on"); cancelAnimationFrame(raf);
      removeEventListener("pointermove", move); document.removeEventListener("pointerover", over);
      removeEventListener("pointerdown", down); removeEventListener("pointerup", up); document.documentElement.removeEventListener("mouseleave", leave); removeEventListener("scroll", scroll);
    };
  }, []);
  return (
    <div className="cur gone" ref={root} aria-hidden="true">
      <div className="cur-ring" ref={ring}>
        <svg ref={inner} className="cur-in" viewBox="0 0 60 60"><circle cx="30" cy="30" r="17" /><path d="M30 1v11M30 48v11M1 30h11M48 30h11" /></svg>
        <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
        <span className="cur-label mono" ref={label} />
      </div>
      <div className="cur-dot" ref={dot} />
      <div className="cur-co mono" ref={co} />
    </div>
  );
}
