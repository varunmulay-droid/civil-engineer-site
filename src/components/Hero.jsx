import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap, reduced, fallbackImage } from "../motion/easings.js";

export default function Hero({ photos }) {
  const root = useRef();
  const fb = useMemo(() => fallbackImage(7), []);
  const img = photos.hero?.src || fb;
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const paths = root.current.querySelectorAll(".draw line, .draw circle");
      paths.forEach((p) => { const l = p.getTotalLength ? p.getTotalLength() : 100; p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .to(paths, { strokeDashoffset: 0, duration: 2.2, stagger: 0.06, ease: "power2.inOut" }, 0)
        .fromTo(".hero-frame", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "expo.inOut" }, 0.1)
        .fromTo(".hero-frame .inner", { scale: 1.3 }, { scale: 1, duration: 2.2 }, 0.1)
        .from(".ln i", { yPercent: 115, duration: 1.2, stagger: 0.12 }, 0.55)
        .from(".hero-fade", { y: 22, opacity: 0, duration: 0.9, stagger: 0.1 }, 1.15);
      gsap.to(".hero-frame .inner", { yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hl", { yPercent: -18, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="top" className="hero" ref={root}>
      <svg className="draw" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[240, 480, 720, 960, 1200].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="900" />)}
        {[180, 400, 620, 800].map((y) => <line key={y} x1="0" y1={y} x2="1440" y2={y} />)}
        {[240, 480, 720, 960].map((x) => <circle key={x} cx={x} cy="90" r="14" />)}
        <line x1="900" y1="860" x2="1360" y2="860" /><line x1="900" y1="848" x2="900" y2="872" /><line x1="1360" y1="848" x2="1360" y2="872" />
      </svg>
      <p className="mono tl hero-fade">STRUCTURAL GRID A–D / 1–4</p>
      <p className="mono dim-l hero-fade">Ø 19.9975° N · 73.7898° E<br />NASHIK, MAHARASHTRA</p>
      <div className="hl">
        <h1>
          <span className="ln"><i>Engineering</i></span>
          <span className="ln"><i>with <em>purpose.</em></i></span>
        </h1>
        <p className="sub hero-fade">Civil engineering and construction for homes, commercial space and infrastructure — planned, engineered and built under one roof.</p>
        <div className="hero-cta hero-fade"><a href="#build" className="cta">See how we build</a><a href="#contact" className="ghost">Talk to an engineer</a></div>
      </div>
      <figure className="hero-frame">
        <div className="inner" style={{ backgroundImage: `url(${img})` }} role="img" aria-label={photos.hero?.alt || "Modern concrete architecture"} />
        <figcaption className="mono">FIG. 01 — {photos.hero ? `Photo ${photos.hero.credit} / Pexels` : "Elevation study"}</figcaption>
      </figure>
      <ul className="hero-stats hero-fade">
        <li><b>25+</b><span className="mono">Years</span></li><li><b>148</b><span className="mono">Projects</span></li><li><b>12</b><span className="mono">Cities</span></li>
      </ul>
    </section>
  );
}
