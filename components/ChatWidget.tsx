"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RISK, SCRIPT, FALLBACK, LINES } from "@/lib/data";

// ============================================================
// CHAT — guionado. NO hay LLM en vivo.
//
// Ver README sección 5, "El chat NO tiene LLM":
// SCRIPT y FALLBACK son respuestas guionadas. NO conectar OpenAI
// ni ningún modelo. Un modelo sin guardarraíles clínicos
// respondiéndole a un menor que expresa ideación de daño es un
// riesgo real de daño y de responsabilidad legal para PAT.
// La IA en vivo se habilita solo cuando: (a) haya revisión por
// profesionales de salud mental, (b) exista protocolo de
// escalamiento a humano operando, (c) haya concepto legal.
//
// "Las conversaciones no se persisten" — no hay tabla de mensajes,
// no hay historial en el perfil de usuario. Este componente
// guarda todo únicamente en memoria de React; nada se envía a
// un backend ni se guarda en storage. No agregar persistencia
// sin revisar esa sección del README primero.
// ============================================================

type Msg = { who: "ia" | "u"; txt: string };

export default function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [crisisOpen, setCrisisOpen] = useState(false);
  const fallbackIdx = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => bubble("ia", "Hola, soy PAT IA. Estoy aquí para escucharte."), 0),
      setTimeout(() => bubble("ia", "Puedes contarme lo que sientes, sin presión."), 450),
      setTimeout(
        () =>
          bubble(
            "ia",
            "No soy psicólogo y no reemplazo atención profesional. Si estás en riesgo o sientes que puedes hacerte daño, te ayudo a llegar a alguien que sí puede acompañarte ya."
          ),
        1000
      ),
      setTimeout(() => bubble("ia", "¿En qué puedo acompañarte hoy?"), 1600),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (crisisOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
  }, [crisisOpen]);

  function bubble(who: "ia" | "u", txt: string) {
    setMessages((m) => [...m, { who, txt }]);
  }

  function send(raw: string) {
    const txt = (raw || "").trim();
    if (!txt) return;
    setInput("");
    bubble("u", txt);

    // --- Protocolo de riesgo: interrumpe el flujo, no responde
    //     dentro de él (ver README, "El protocolo de crisis
    //     interrumpe"). Nunca convertir esto en un banner o en
    //     un mensaje más de la conversación.
    if (RISK.test(txt) || SCRIPT[txt] === "__CRISIS__") {
      setTimeout(() => setCrisisOpen(true), 420);
      return;
    }
    const r = SCRIPT[txt] || FALLBACK[fallbackIdx.current++ % FALLBACK.length];
    setTimeout(() => bubble("ia", r), 620);
  }

  function closeCrisis() {
    setCrisisOpen(false);
    bubble(
      "ia",
      "Me alegra que sigas aquí. No tienes que contarme nada más si no quieres — pero tampoco tienes que irte."
    );
    bubble("ia", "Si en algún momento cambia, el 106 está abierto 24 horas.");
  }

  return (
    <>
      <div className="chat-wrap">
        <div className="wrap" style={{ paddingInline: 0 }}>
          <div className="chat">
            <div className="chat-hd">
              <span className="dot"></span>
              <b>PAT IA</b>
              <span className="meta">Acompañamiento inicial</span>
            </div>
            <div className="chat-body" id="cbody" aria-live="polite" ref={bodyRef}>
              {messages.map((m, i) => (
                <div className={`msg msg-${m.who === "ia" ? "ia" : "u"}`} key={i}>
                  {m.txt.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="chat-quick" id="cquick">
              {Object.keys(SCRIPT).map((k) => (
                <button className="qk" key={k} onClick={() => send(k)}>
                  {k}
                </button>
              ))}
            </div>
            <div className="chat-in">
              <input
                id="cin"
                placeholder="Escribe aquí…"
                aria-label="Escribe tu mensaje"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send(input);
                }}
              />
              <button className="chat-send" id="csend" aria-label="Enviar" onClick={() => send(input)}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                >
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="chat-disc">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="16"
              height="16"
              style={{ flex: "none", marginTop: 1 }}
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>
              <b>PAT IA no reemplaza atención psicológica o médica profesional.</b>{" "}
              Si estás en peligro, llama al 123 o a la línea 106. Esta
              conversación no se guarda ni se asocia a tu perfil.
            </span>
          </p>
        </div>
      </div>

      {/* Protocolo de crisis — pantalla completa, no un banner. */}
      <div
        className={`crisis ${crisisOpen ? "on" : ""}`}
        id="crisis"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-h"
      >
        <div className="crisis-in">
          <h2 id="crisis-h">Vamos a buscar ayuda ahora.</h2>
          <p>
            Lo que estás sintiendo importa y no tienes que resolverlo solo.
            Estas líneas son gratuitas, confidenciales y del otro lado hay
            una persona real esperando tu llamada.
          </p>
          <div className="crisis-lines" id="crisis-lines">
            {LINES.slice(0, 3).map((l) => (
              <a href={`tel:${l.tel}`} className="cl" key={l.n}>
                <span className="cl-n">{l.n}</span>
                <span className="cl-t">
                  <b>{l.t}</b>
                  <span>{l.s}</span>
                </span>
              </a>
            ))}
          </div>
          <div className="crisis-foot">
            <Link
              href="/ayuda"
              className="btn"
              style={{ background: "#fff", color: "var(--mr-deep)", justifyContent: "center" }}
            >
              Ver todos los recursos
            </Link>
            <button
              className="btn btn-o"
              style={{ justifyContent: "center" }}
              id="crisis-close"
              ref={closeBtnRef}
              onClick={closeCrisis}
            >
              Ya estoy a salvo, volver al chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
