import { useLayoutEffect, useRef } from "react";
import { gsap, reduced } from "../motion/easings.js";
const text = "We engineer first, then build — so what is drawn is exactly what stands. In-house structural engineers, site supervision and quality audits keep timelines honest and structures sound.";
export default function Manifesto() {
  const root = useRef();
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".w", { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: root.current, start: "top 78%", end: "bottom 60%", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="manifesto" ref={root}>
      <p className="mono">01 — Approach</p>
      <p className="big-p">{text.split(" ").map((w, i) => <span className="w" key={i}>{w} </span>)}</p>
    </section>
  );
}
