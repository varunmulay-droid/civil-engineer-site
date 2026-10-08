import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isMobile = () => matchMedia("(max-width: 820px)").matches;
export const canWebGL = () => {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
};
// Procedural "architectural" placeholder so the site is never empty without Pexels.
export function fallbackImage(seed = 1, tone = 0) {
  const c = document.createElement("canvas"); c.width = 900; c.height = 600;
  const x = c.getContext("2d"); let s = seed * 9301 + 49297; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const g = x.createLinearGradient(0, 0, 900, 600);
  g.addColorStop(0, tone ? "#3b3a37" : "#2a2824"); g.addColorStop(1, tone ? "#16181a" : "#0e0f10"); x.fillStyle = g; x.fillRect(0, 0, 900, 600);
  for (let i = 0; i < 7; i++) { const w = 70 + r() * 110, h = 140 + r() * 360, px = r() * 820; x.fillStyle = `rgba(215,139,61,${0.05 + r() * 0.12})`; x.fillRect(px, 600 - h, w, h); x.strokeStyle = "rgba(241,240,234,.18)"; x.strokeRect(px, 600 - h, w, h); for (let f = 1; f < h / 36; f++) { x.beginPath(); x.moveTo(px, 600 - f * 36); x.lineTo(px + w, 600 - f * 36); x.stroke(); } }
  for (let i = 0; i < 2500; i++) { x.fillStyle = `rgba(255,255,255,${r() * 0.05})`; x.fillRect(r() * 900, r() * 600, 1.5, 1.5); }
  return c.toDataURL("image/jpeg", 0.85);
}
