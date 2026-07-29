import Footer from "@/components/Footer";
import { LINES, LINES_REG } from "@/lib/data";

export const metadata = { title: "Recursos de ayuda — PAT" };

export default function Ayuda() {
  return (
    <>
      <section className="sec mr">
        <div className="wrap">
          <span className="eyebrow" style={{ color: "var(--mr-accent)" }}>
            Recursos de ayuda
          </span>
          <h1 className="display" style={{ fontSize: "clamp(30px,5vw,60px)", marginBlock: "14px 16px", maxWidth: "18ch" }}>
            Si necesitas hablar con alguien ahora.
          </h1>
          <p className="lede" style={{ maxWidth: "56ch", marginBottom: 32 }}>
            Todas estas líneas son gratuitas y confidenciales. Del otro lado
            hay profesionales de salud mental, no un robot.
          </p>

          <h5 className="eyebrow" style={{ color: "var(--mr-deep)", marginBottom: 14 }}>
            Nacional
          </h5>
          <div className="help-grid">
            {LINES.map((l) => (
              <a href={`tel:${l.tel}`} className="help" key={l.n}>
                <span className="help-n">{l.n}</span>
                <span className="help-t">
                  <b>{l.t}</b>
                  <span>{l.s}</span>
                </span>
              </a>
            ))}
          </div>

          <h5 className="eyebrow" style={{ color: "var(--mr-deep)", margin: "32px 0 14px" }}>
            Costa Caribe
          </h5>
          <div className="help-grid">
            {LINES_REG.map((l, i) => (
              <a href={`tel:${l.tel}`} className="help" key={`${l.n}-${i}`}>
                <span className="help-n" style={{ fontSize: 16 }}>
                  {l.n}
                </span>
                <span className="help-t">
                  <b>{l.t}</b>
                  <span>{l.s}</span>
                </span>
              </a>
            ))}
          </div>

          <div className="note">
            <b>Nota para el equipo PAT:</b> verificar estos números con las
            secretarías de salud antes de publicar, y revisarlos cada seis
            meses. Un número desactualizado en una pantalla de crisis es
            peor que no tener la pantalla.
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
