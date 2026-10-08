import { company } from "../data.js";
export default function Contact() {
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hello, I'd like to discuss a project.")}`;
  return (
    <section id="contact" className="contact">
      <p className="mono">08 — Contact</p>
      <h2>Have a project<br />in mind?</h2>
      <p className="lead">Let's build something that lasts.</p>
      <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.target); location.href = `mailto:${company.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(`${f.get("msg")}\n\n— ${f.get("name")} (${f.get("phone")})`)}`; }}>
        <input name="name" placeholder="Name" required aria-label="Name" /><input name="phone" placeholder="Phone" required aria-label="Phone" />
        <textarea name="msg" placeholder="Tell us about the project" rows={3} required aria-label="Project details" />
        <button className="cta">Start a project</button>
      </form>
      <p className="mono links"><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a> · <a href={`mailto:${company.email}`}>{company.email}</a> · <a href={wa} target="_blank" rel="noreferrer">WhatsApp</a> · <a href="https://maps.google.com/?q=Nashik" target="_blank" rel="noreferrer">Map</a></p>
    </section>
  );
}
