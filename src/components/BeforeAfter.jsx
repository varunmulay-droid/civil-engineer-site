import { useMemo, useState } from "react";
import { fallbackImage } from "../motion/easings.js";
import { useTheme } from "../theme.jsx";
export default function BeforeAfter({ photos }) {
  const [v, setV] = useState(50);
  const { theme } = useTheme();
  const fb = useMemo(() => [fallbackImage(21, 1, theme), fallbackImage(22, 0, theme)], [theme.id]);
  const b = photos.before?.src || fb[0], a = photos.after?.src || fb[1];
  return (
    <section className="ba">
      <div className="ba-head"><p className="mono">06 — Transformation</p><h2>Drag to see<br />the difference.</h2></div>
      <div className="ba-stage" data-cursor="slide" style={{ "--v": `${v}%` }}>
        <div className="ba-img" style={{ backgroundImage: `url(${a})` }} role="img" aria-label="After renovation" />
        <div className="ba-img before" style={{ backgroundImage: `url(${b})` }} role="img" aria-label="Before renovation" />
        <span className="mono tag l">Before</span><span className="mono tag r">After</span>
        <div className="ba-line"><i /></div>
        <input type="range" min="0" max="100" value={v} onChange={(e) => setV(+e.target.value)} aria-label="Before and after comparison" />
      </div>
    </section>
  );
}
