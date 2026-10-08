import { useEffect, useRef, useState } from "react";
import { process as steps } from "../data.js";
export default function Process() {
  const [a, setA] = useState(0), refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setA(+e.target.dataset.i)), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el)); return () => io.disconnect();
  }, []);
  return (
    <section id="process" className="process">
      <div className="pin"><p className="mono">05 — Process</p><div className="big">{String(a + 1).padStart(2, "0")}</div><div className="prog"><i style={{ height: `${((a + 1) / steps.length) * 100}%` }} /></div></div>
      <ol>{steps.map((s, k) => (<li key={s.t} data-i={k} ref={(el) => (refs.current[k] = el)} className={k === a ? "act" : ""}><span className="mono">{String(k + 1).padStart(2, "0")}</span><h3>{s.t}</h3><p>{s.d}</p></li>))}</ol>
    </section>
  );
}
