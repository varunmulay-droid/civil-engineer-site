import { useState } from "react";
import { materials } from "../data.js";
export default function Materials() {
  const [a, setA] = useState(0); const m = materials[a];
  return (
    <section id="materials" className="mat" data-m={m.k.toLowerCase()}>
      <div className="mat-bg" aria-hidden="true" />
      <p className="mono">04 — Materials</p>
      <ul>{materials.map((x, k) => (
        <li key={x.k}><button className={k === a ? "act" : ""} onMouseEnter={() => setA(k)} onFocus={() => setA(k)} onClick={() => setA(k)}>
          <span className="mono">0{k + 1}</span>{x.k}</button></li>))}
      </ul>
      <dl key={m.k}><dt className="mono">Specification</dt><dd>{m.grade}</dd><dt className="mono">Used for</dt><dd>{m.use}</dd><dt className="mono">Control</dt><dd>{m.note}</dd></dl>
    </section>
  );
}
