import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { gsap, reduced, canWebGL, fallbackImage } from "../motion/easings.js";
import { projects } from "../data.js";
import { useTheme } from "../theme.jsx";
const Liquid = lazy(() => import("../three/LiquidSlider.jsx"));

export default function Projects({ photos, ready }) {
  const [i, setI] = useState(0), [on, setOn] = useState(false), [gl, setGl] = useState(false);
  const root = useRef(), cur = useRef(), sx = useRef(0);
  useEffect(() => { setGl(canWebGL() && !reduced()); }, []);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting)); io.observe(root.current); return () => io.disconnect(); }, []);
  const fb = useMemo(() => projects.map((_, k) => fallbackImage(k + 2, k % 2, theme)), [theme.id]);
  const urls = useMemo(() => projects.map((p, k) => (photos[p.slot]?.tex ? `/api/img?u=${encodeURIComponent(photos[p.slot].tex)}` : fb[k])), [photos, fb]);
  const bg = (k) => photos[projects[k].slot]?.src || fb[k];
  const go = (d) => setI((x) => (x + d + projects.length) % projects.length);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => { gsap.fromTo(".meta .ln i", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.35 }); gsap.fromTo(".meta .fade", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, delay: 0.6, ease: "expo.out" }); }, cur);
    return () => ctx.revert();
  }, [i]);
  const p = projects[i];
  return (
    <section id="projects" className="slider" ref={root} data-cursor="drag" tabIndex={0} aria-label="Selected projects"
      onKeyDown={(e) => e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" && go(-1)}
      onPointerDown={(e) => (sx.current = e.clientX)} onPointerUp={(e) => { const d = e.clientX - sx.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}>
      <div className="gl">
        {gl && ready ? <Suspense fallback={null}><Liquid urls={urls} index={i} active={on} /></Suspense>
          : projects.map((_, k) => <div key={k} className={"fade-layer" + (k === i ? " on" : "")} style={{ backgroundImage: `url(${bg(k)})` }} />)}
      </div>
      <div className="shade" />
      <p className="mono sl-label">03 — Selected work</p>
      <div className="meta" ref={cur} key={p.id}>
        <span className="mono fade">PROJECT {String(p.id).padStart(2, "0")}</span>
        <h2><span className="ln"><i>{p.title}</i></span></h2>
        <p className="mono fade">{p.location}</p><p className="mono dim fade">{p.category} · {p.year} · {p.area}</p>
      </div>
      <div className="ctl">
        <button onClick={() => go(-1)} aria-label="Previous project">←</button>
        <span className="mono">{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        <button onClick={() => go(1)} aria-label="Next project">→</button>
      </div>
      <div className="bar"><i style={{ width: `${((i + 1) / projects.length) * 100}%` }} /></div>
    </section>
  );
}
