import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, seg, reduced, canWebGL } from "../motion/easings.js";
import { stages } from "../data.js";
const Model = lazy(() => import("../three/ConstructionModel.jsx"));

export default function Signature() {
  const root = useRef(), progress = useRef(0), pct = useRef(), bar = useRef();
  const [gl, setGl] = useState(false), [on, setOn] = useState(false);
  useEffect(() => { setGl(canWebGL() && !reduced()); }, []);
  useLayoutEffect(() => {
    const el = root.current; const paths = [...el.querySelectorAll(".bp path")];
    const lens = paths.map((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = l; return l; });
    const apply = (p) => {
      progress.current = p; pct.current.textContent = Math.round(p * 100);
      el.dataset.stage = Math.min(3, Math.floor(p * 4)); bar.current.style.transform = `scaleY(${p})`;
      paths.forEach((pa, i) => (pa.style.strokeDashoffset = lens[i] * (1 - seg(p, i * 0.1, i * 0.1 + 0.35))));
    };
    if (reduced()) { apply(1); return; }
    apply(0);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: el, start: "top top", end: "+=320%", pin: true, scrub: true, onUpdate: (s) => apply(s.progress), onToggle: (s) => setOn(s.isActive), refreshPriority: 1 });
    }, el);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "200px" });
    io.observe(root.current); return () => io.disconnect();
  }, []);
  return (
    <section id="build" className="sig" ref={root} data-stage="0">
      <div className="sig-gl">{gl && <Suspense fallback={null}><Model progress={progress} active={on} /></Suspense>}</div>
      <svg className="bp" viewBox="0 0 400 300" aria-hidden="true">
        <path d="M40 260 H360" /><path d="M60 260 V60 H340 V260" /><path d="M60 110 H340" /><path d="M60 160 H340" /><path d="M60 210 H340" />
        <path d="M150 60 V260" /><path d="M250 60 V260" /><path d="M40 60 L200 20 L360 60" />
      </svg>
      <div className="sig-copy">
        <p className="mono">02 — From blueprint to built</p>
        <h2>Watch a structure<br />come together.</h2>
        <ol className="stages">{stages.map((s, i) => <li key={s} data-i={i}><span className="mono">0{i + 1}</span>{s}</li>)}</ol>
      </div>
      <div className="sig-meter"><i ref={bar} /><div><b ref={pct}>0</b><em>%</em><span className="mono">Structural phase</span></div></div>
      {!gl && <p className="mono sig-note">Scroll to track the build · 3D view available on WebGL devices</p>}
    </section>
  );
}
