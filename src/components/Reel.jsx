import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap, reduced, fallbackImage } from "../motion/easings.js";
import { useTheme } from "../theme.jsx";
import VideoBg from "./VideoBg.jsx";
export default function Reel({ photos }) {
  const root = useRef(), { theme } = useTheme(), v = photos.reel;
  const fb = useMemo(() => fallbackImage(31, 1, theme), [theme.id]);
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".reel-bg", { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from(".reel .ln i", { yPercent: 115, duration: 1.2, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 60%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="reel" ref={root} data-cursor="play">
      <div className="reel-bg" style={{ backgroundImage: `url(${v?.poster || fb})` }}><VideoBg src={v?.src} poster={v?.poster} /></div>
      <div className="reel-shade" />
      <div className="reel-copy"><p className="mono">Site reel</p><h2><span className="ln"><i>Built on site,</i></span><span className="ln"><i>not on slides.</i></span></h2></div>
      <p className="mono reel-credit">{v ? `Video by ${v.credit} / Pexels` : "148 projects · 12 cities"}</p>
    </section>
  );
}
