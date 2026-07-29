import Link from "next/link";

export default function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-in">
          <div>
            <div className="logo">
              <span className="logo-mark">
                <span>P</span>
              </span>
              <span className="logo-word">
                People
                <br />
                Are Talking
              </span>
            </div>
            <p className="ft-abt">
              People Are Talking es una plataforma joven de contenidos,
              comunidad, bienestar, tendencias y comercio independiente.
            </p>
          </div>
          <div>
            <h5>Navegación</h5>
            <ul>
              <li>
                <Link href="/">Inicio</Link>
              </li>
              <li>
                <Link href="/actualidad">Actualidad</Link>
              </li>
              <li>
                <Link href="/tendencias">Tendencias</Link>
              </li>
              <li>
                <Link href="/mente-real">Mente Real</Link>
              </li>
              <li>
                <Link href="/talento">Talento</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul>
              <li>
                <Link href="/pronto/terminos">Términos y condiciones</Link>
              </li>
              <li>
                <Link href="/pronto/privacidad">Política de privacidad</Link>
              </li>
              <li>
                <Link href="/pronto/cookies">Política de cookies</Link>
              </li>
              <li>
                <Link href="/ayuda">Recursos de ayuda</Link>
              </li>
              <li>
                <Link href="/marcas">Marcas</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Newsletter</h5>
            <p className="ft-abt" style={{ marginTop: 0 }}>
              Recibe lo más importante de PAT cada semana.
            </p>
            <div className="ft-nl">
              <input placeholder="Tu correo" aria-label="Correo" />
              <button className="btn btn-y btn-sm">Suscribirme</button>
            </div>
            <h5 style={{ marginTop: 22 }}>Síguenos</h5>
            <ul style={{ flexDirection: "row", gap: 14 }}>
              <li>
                <Link href="/">Instagram</Link>
              </li>
              <li>
                <Link href="/">TikTok</Link>
              </li>
              <li>
                <Link href="/">YouTube</Link>
              </li>
              <li>
                <Link href="/">Spotify</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="ft-btm">
          <p>© 2026 People Are Talking. Todos los derechos reservados.</p>
          <p>Hecho para la gente joven</p>
        </div>
      </div>
    </footer>
  );
}
