import { useEffect, useState } from "react";
import { ScrollTrigger } from "./motion/easings.js";
import Nav from "./components/Nav.jsx"; import Hero from "./components/Hero.jsx"; import Manifesto from "./components/Manifesto.jsx";
import Signature from "./components/Signature.jsx"; import Projects from "./components/Projects.jsx"; import Materials from "./components/Materials.jsx";
import Process from "./components/Process.jsx"; import BeforeAfter from "./components/BeforeAfter.jsx"; import Stats from "./components/Stats.jsx";
import Testimonials from "./components/Testimonials.jsx"; import Contact from "./components/Contact.jsx";

export default function App() {
  const [photos, setPhotos] = useState({}), [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 4000);
    fetch("/api/photos").then((r) => r.json()).then(setPhotos).catch(() => {}).finally(() => { clearTimeout(t); setReady(true); });
    const r = () => ScrollTrigger.refresh(); addEventListener("load", r); document.fonts?.ready.then(r);
    return () => removeEventListener("load", r);
  }, []);
  return (
    <>
      <Nav />
      <main>
        <Hero photos={photos} /><Manifesto /><Signature /><Projects photos={photos} ready={ready} />
        <Materials /><Process /><BeforeAfter photos={photos} /><Stats /><Testimonials /><Contact />
      </main>
      <footer className="mono">© {new Date().getFullYear()} Sahyadri Structures · Photography via <a href="https://www.pexels.com" target="_blank" rel="noreferrer">Pexels</a></footer>
      <div className="cursor" aria-hidden="true">VIEW</div>
    </>
  );
}
