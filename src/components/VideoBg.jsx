import { useEffect, useRef, useState } from "react";
import { reduced } from "../motion/easings.js";
// Plays only while on screen; skipped for reduced-motion and data-saver users.
export default function VideoBg({ src, poster }) {
  const ref = useRef(), [ok, setOk] = useState(false);
  const skip = !src || reduced() || navigator.connection?.saveData;
  useEffect(() => {
    if (skip) return; const v = ref.current;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.15 });
    io.observe(v); return () => io.disconnect();
  }, [skip, src]);
  if (skip) return null;
  return <video ref={ref} className={"vid" + (ok ? " ok" : "")} src={src} poster={poster} muted loop playsInline preload="metadata" onCanPlay={() => setOk(true)} aria-hidden="true" />;
}
