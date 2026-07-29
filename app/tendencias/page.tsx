import Link from "next/link";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import { TREND, RADAR } from "@/lib/data";

export const metadata = { title: "Tendencias — PAT" };

const MOVE_LABEL: Record<string, string> = {
  up: "↑ SUBE",
  new: "NUEVO",
  flat: "— IGUAL",
};
const MOVE_CLASS: Record<string, string> = {
  up: "mv-up",
  new: "mv-new",
  flat: "mv-fl",
};

export default function Tendencias() {
  return (
    <>
      <section className="sec dark" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Semana del 13 al 19 de julio</span>
              <h2 className="display">Top 10 de la semana</h2>
            </div>
            <p className="meta">Lo más hablado, compartido y buscado</p>
          </div>
          <div className="rank">
            {TREND.map((t) => (
              <Link href="/articulo/creadores" className="rk" key={t.n}>
                <span className="rk-n">{String(t.n).padStart(2, "0")}</span>
                <div className="rk-t">
                  <h3>{t.t}</h3>
                  <span className="meta">
                    {t.c} · {t.d}
                  </span>
                </div>
                <span className={`rk-mv ${MOVE_CLASS[t.m]}`}>{MOVE_LABEL[t.m]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Ticker inv />

      <section className="sec">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <span className="eyebrow">Radar PAT</span>
              <h2 className="display">Lo que viene</h2>
            </div>
          </div>
          <div className="mr-grid">
            {RADAR.map((r, i) => (
              <div className="card" style={{ padding: 22, background: "var(--pat-bone)" }} key={r.t}>
                <span className="rk-n" style={{ color: "var(--pat-black)", fontSize: 34, marginBottom: 12 }}>
                  0{i + 1}
                </span>
                <h3 style={{ fontSize: 19, marginBottom: 8 }}>{r.t}</h3>
                <p className="lede" style={{ fontSize: 14.5 }}>
                  {r.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
