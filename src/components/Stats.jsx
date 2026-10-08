import { useLayoutEffect, useRef } from "react";
import { gsap, reduced } from "../motion/easings.js";
import { stats } from "../data.js";
export default function Stats() {
  const root = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      root.current.querySelectorAll("[data-n]").forEach((el) => {
        const n = +el.dataset.n, dec = +el.dataset.dec || 0, suf = el.dataset.suf, o = { v: reduced() ? n : 0 };
        const set = () => (el.textContent = o.v.toFixed(dec) + suf); set();
        if (reduced()) return;
        gsap.to(o, { v: n, duration: 1.8, ease: "expo.out", onUpdate: set, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="stats" ref={root}>
      {stats.map((s) => (<div key={s.label}><b data-n={s.n} data-dec={s.dec || 0} data-suf={s.suffix}>0</b><span className="mono">{s.label}</span></div>))}
    </section>
  );
}
