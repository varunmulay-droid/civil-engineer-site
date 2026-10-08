import { useEffect, useRef, useState } from "react";
import { company, projects, stats, process as steps } from "./data.js";

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.15 });
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Count({ n, dec = 0, suffix }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduce) return setV(n);
      const t0 = performance.now();
      const tick = (t) => { const p = Math.min((t - t0) / 1400, 1); setV(n * (1 - Math.pow(1 - p, 3))); p < 1 && requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [n]);
  return <span ref={ref}>{v.toFixed(dec)}{suffix}</span>;
}

function Slider({ photos }) {
  const [i, setI] = useState(0);
  const go = (d) => setI((x) => (x + d + projects.length) % projects.length);
  const sx = useRef(0);
  return (
    <section id="projects" className="slider" tabIndex={0} aria-label="Selected projects"
      onKeyDown={(e) => e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" && go(-1)}
      onPointerDown={(e) => (sx.current = e.clientX)}
      onPointerUp={(e) => { const dx = e.clientX - sx.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}>
      {projects.map((p, k) => (
        <div key={p.id} className={"slide" + (k === i ? " on" : "")} aria-hidden={k !== i}>
          <div className="img" style={photos[p.slot] ? { backgroundImage: `url(${photos[p.slot].src})` } : undefined} role="img" aria-label={photos[p.slot]?.alt || p.title} />
          <div className="shade" />
          <div className="meta">
            <span className="mono">PROJECT {String(p.id).padStart(2, "0")}</span>
            <h2>{p.title}</h2>
            <p className="mono">{p.location}</p>
            <p className="mono dim">{p.category} · {p.year} · {p.area}</p>
          </div>
        </div>
      ))}
      <div className="ctl">
        <button onClick={() => go(-1)} aria-label="Previous project">←</button>
        <span className="mono">{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        <button onClick={() => go(1)} aria-label="Next project">→</button>
      </div>
      <div className="bar"><i style={{ width: `${((i + 1) / projects.length) * 100}%` }} /></div>
    </section>
  );
}

function Process() {
  const [a, setA] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setA(+e.target.dataset.i)), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section id="process" className="process">
      <div className="pin">
        <p className="mono">FROM BLUEPRINT TO BUILT</p>
        <div className="big">{String(a + 1).padStart(2, "0")}</div>
        <div className="prog"><i style={{ height: `${((a + 1) / steps.length) * 100}%` }} /></div>
      </div>
      <ol>
        {steps.map((s, k) => (
          <li key={s.t} data-i={k} ref={(el) => (refs.current[k] = el)} className={k === a ? "act" : ""}>
            <span className="mono">{String(k + 1).padStart(2, "0")}</span>
            <h3>{s.t}</h3><p>{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function App() {
  const [photos, setPhotos] = useState({});
  const [menu, setMenu] = useState(false);
  useEffect(() => { fetch("/api/photos").then((r) => r.json()).then(setPhotos).catch(() => {}); }, []);
  useReveal();
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hello, I'd like to discuss a project.")}`;
  const hero = photos.hero;
  return (
    <>
      <header className="nav">
        <a href="#top" className="logo">SAHYADRI<b>/</b>STRUCTURES</a>
        <nav className={menu ? "open" : ""} onClick={() => setMenu(false)}>
          <a href="#projects">Projects</a><a href="#process">Process</a><a href="#about">About</a>
          <a href="#contact" className="cta sm">Start a project</a>
        </nav>
        <button className="burger" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}>{menu ? "CLOSE" : "MENU"}</button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hbg" style={hero ? { backgroundImage: `url(${hero.src})` } : undefined} role="img" aria-label={hero?.alt || ""} />
          <div className="grid-lines" aria-hidden="true" />
          <div className="hcopy">
            <p className="mono h1">Nashik — 19.9975° N, 73.7898° E</p>
            <h1><span>25+ years of</span><span>building structures</span><span><em>that last.</em></span></h1>
            <p className="sub h2">Civil engineering and construction for homes, commercial space and infrastructure — planned, engineered and built under one roof.</p>
            <div className="h3"><a href="#projects" className="cta">View projects</a><a href="#contact" className="ghost">Talk to an engineer</a></div>
          </div>
          <p className="mono hmeta">01 / 04 · {projects[0].title}</p>
        </section>

        <section id="about" className="about rv">
          <p className="mono">About</p>
          <h2>We engineer first, then build — so what is drawn is exactly what stands.</h2>
          <p>{company.name} is a civil engineering and construction firm in {company.city}. In-house structural engineers, site supervision and quality audits keep timelines honest and structures sound.</p>
          {photos.about && <img loading="lazy" src={photos.about.src} alt={photos.about.alt} />}
        </section>

        <Slider photos={photos} />
        <Process />

        <section className="stats">
          {stats.map((s) => (
            <div key={s.label} className="rv"><b><Count {...s} /></b><span className="mono">{s.label}</span></div>
          ))}
        </section>

        <section id="contact" className="contact rv">
          <h2>Have a project<br />in mind?</h2>
          <p className="lead">Let's build something that lasts.</p>
          <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.target); location.href = `mailto:${company.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(`${f.get("msg")}\n\n— ${f.get("name")} (${f.get("phone")})`)}`; }}>
            <input name="name" placeholder="Name" required aria-label="Name" />
            <input name="phone" placeholder="Phone" required aria-label="Phone" />
            <textarea name="msg" placeholder="Tell us about the project" rows={3} required aria-label="Project details" />
            <button className="cta">Start a project</button>
          </form>
          <p className="mono links"><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a> · <a href={`mailto:${company.email}`}>{company.email}</a> · <a href={wa} target="_blank" rel="noreferrer">WhatsApp</a> · <a href="https://maps.google.com/?q=Nashik" target="_blank" rel="noreferrer">Map</a></p>
        </section>
      </main>
      <footer className="mono">© {new Date().getFullYear()} {company.name}. Photos by <a href="https://www.pexels.com" target="_blank" rel="noreferrer">Pexels</a> photographers.</footer>
    </>
  );
}
