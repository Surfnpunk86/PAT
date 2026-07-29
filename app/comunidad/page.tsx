import Footer from "@/components/Footer";
import JoinForm from "@/components/JoinForm";

export const metadata = { title: "Comunidad — PAT" };

export default function Comunidad() {
  return (
    <>
      <section className="sec join">
        <div className="wrap">
          <div className="join-in">
            <div>
              <span className="eyebrow">Comunidad</span>
              <h2 className="display" style={{ marginTop: 12 }}>
                Únete a la comunidad PAT
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: "38ch", marginBottom: 20 }}>
                Recibe tendencias, descuentos, convocatorias, planes y
                contenidos creados para lo que estás viviendo ahora.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, fontSize: 14, fontWeight: 500 }}>
                <li>— Guarda artículos, planes y cupones</li>
                <li>— Participa en concursos</li>
                <li>— Sigue a tus marcas y creadores</li>
                <li>— Vota en los rankings</li>
                <li>— Envía tus historias</li>
              </ul>
            </div>
            <div>
              <JoinForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
