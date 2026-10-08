import { useEffect, useRef, useState } from "react";
import { gsap, reduced } from "../motion/easings.js";
import { quotes } from "../data.js";
export default function Testimonials() {
  const [i, setI] = useState(0), ref = useRef();
  useEffect(() => { if (reduced()) return; gsap.fromTo(ref.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, ease: "expo.out" }); }, [i]);
  const q = quotes[i];
  return (
    <section className="tst">
      <p className="mono">07 — Clients</p>
      <blockquote ref={ref} key={i}><p>“{q.q}”</p><footer className="mono">— {q.who}<br />{q.meta}</footer></blockquote>
      <div className="ctl static">
        <button onClick={() => setI((i + quotes.length - 1) % quotes.length)} aria-label="Previous quote">←</button>
        <span className="mono">{i + 1} / {quotes.length}</span>
        <button onClick={() => setI((i + 1) % quotes.length)} aria-label="Next quote">→</button>
      </div>
    </section>
  );
}
