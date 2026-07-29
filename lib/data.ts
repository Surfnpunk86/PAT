// ============================================================
// DATOS — contenido de muestra.
// Todos los nombres de talento son ficticios.
// Reemplazar por el roster real de PAT antes de producción.
// Ver README sección 8: "CMS para Actualidad / Mente Real
// (Renzo tiene que poder publicar sin ti)".
// ============================================================

export const NAV: [string, string][] = [
  ["Inicio", "/"],
  ["Actualidad", "/actualidad"],
  ["Tendencias", "/tendencias"],
  ["Mente Real", "/mente-real"],
  ["Talento", "/talento"],
  ["Entrevistas", "/pronto/entrevistas"],
  ["Podcast", "/pronto/podcast"],
  ["Planes", "/pronto/planes"],
  ["Market", "/pronto/marketplace"],
  ["Cupones", "/pronto/cupones"],
  ["Concursos", "/pronto/concursos"],
  ["Marcas", "/marcas"],
  ["Comunidad", "/comunidad"],
];

export const MOBILE_NAV: { t: string; u: string; d: string }[] = [
  { t: "Inicio", u: "/", d: "M3 11l9-8 9 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  { t: "Tendencias", u: "/tendencias", d: "M22 7l-8.5 8.5-5-5L2 17" },
  {
    t: "Mente Real",
    u: "/mente-real",
    d: "M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z",
  },
  {
    t: "Market",
    u: "/pronto/marketplace",
    d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  },
  {
    t: "Perfil",
    u: "/comunidad",
    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  },
];

export const TICKER: [string, string][] = [
  ["Top 10 de la semana", "TENDENCIAS"],
  ["La ansiedad silenciosa de vivir conectado", "MENTE REAL"],
  ["Cinco marcas locales creando estilo propio", "ACTUALIDAD"],
  ["Convocatoria de nuevos talentos", "PAT CHALLENGES"],
  ["Emprender antes de los 25", "PODCAST"],
  ["La Gen Z cambió la forma de comprar", "CULTURA"],
  ["Radar PAT: lo que viene", "TENDENCIAS"],
  ["Compra local, compra con criterio", "PAT MARKET"],
];

export type Article = {
  id: string;
  cat: string;
  t: string;
  r: number;
  a: string;
  d: string;
  s: string;
  v: number;
};

export const ARTS: Article[] = [
  {
    id: "genz",
    cat: "Cultura joven",
    t: "Cómo la Generación Z está cambiando la forma de comprar",
    r: 5,
    a: "Redacción PAT",
    d: "15 JUL 2026",
    s: "Ya no compran por marca. Compran por criterio, por historia y por quién se lo recomendó. Lo que eso significa para cualquiera que quiera venderles algo.",
    v: 1,
  },
  {
    id: "ansiedad",
    cat: "Bienestar",
    t: "La ansiedad silenciosa de vivir conectado todo el día",
    r: 6,
    a: "Redacción PAT",
    d: "14 JUL 2026",
    s: "No es dramática ni visible. Es el zumbido de fondo de revisar el teléfono ochenta veces sin razón.",
    v: 2,
  },
  {
    id: "marcas",
    cat: "Emprendimiento",
    t: "Cinco marcas locales que están creando estilo propio",
    r: 4,
    a: "Redacción PAT",
    d: "12 JUL 2026",
    s: "Talleres pequeños, tirajes cortos y una idea muy clara de a quién le hablan.",
    v: 3,
  },
  {
    id: "finde",
    cat: "Ciudad",
    t: "Qué hacer este fin de semana si quieres salir sin gastar demasiado",
    r: 3,
    a: "Redacción PAT",
    d: "11 JUL 2026",
    s: "Doce planes reales por menos de lo que cuesta un domicilio.",
    v: 4,
  },
  {
    id: "creadores",
    cat: "Redes",
    t: "Creadores jóvenes que están moviendo la conversación",
    r: 5,
    a: "Redacción PAT",
    d: "10 JUL 2026",
    s: "No son los más grandes. Son los que están haciendo que la gente hable.",
    v: 1,
  },
];

export const TREND: {
  n: number;
  t: string;
  c: string;
  m: "up" | "new" | "flat";
  d: string;
}[] = [
  { n: 1, t: "Audios largos en vez de mensajes de texto", c: "Redes", m: "up", d: "+312% en menciones" },
  { n: 2, t: "Ropa de segunda como statement, no como ahorro", c: "Moda", m: "new", d: "Entrada directa" },
  { n: 3, t: "Cafés que cierran el wifi a las 6 p.m.", c: "Ciudad", m: "up", d: "+88%" },
  { n: 4, t: "Salsa colombiana en sets de electrónica", c: "Música", m: "up", d: "+140%" },
  { n: 5, t: "Contenido sin edición, grabado de una toma", c: "Creación", m: "flat", d: "Estable" },
  { n: 6, t: "Domingos sin teléfono", c: "Bienestar", m: "new", d: "Entrada directa" },
  { n: 7, t: "Marcas que responden en comentarios como personas", c: "Marketing", m: "up", d: "+64%" },
  { n: 8, t: "Universidad y freelance al mismo tiempo", c: "Trabajo", m: "flat", d: "Estable" },
  { n: 9, t: "Fotografía análoga en Barranquilla", c: "Arte", m: "up", d: "+41%" },
  { n: 10, t: "Grupos de WhatsApp como red social principal", c: "Redes", m: "flat", d: "Estable" },
];

export const RADAR: { t: string; d: string }[] = [
  {
    t: "Comercio dentro del chat",
    d: "Comprar sin salir de la conversación. Ya pasa; falta que las marcas locales lo entiendan.",
  },
  {
    t: "Creadores con marca propia, no con patrocinio",
    d: "El siguiente paso del roster: dejar de alquilar audiencia y empezar a vender producto.",
  },
  {
    t: "Salud mental como tema de marca",
    d: "Las marcas van a querer hablar de esto. La mayoría lo va a hacer mal.",
  },
];

export type Talent = {
  id: string;
  n: string;
  h: string;
  c: string[];
  p: string;
  r: string;
  v: number;
  b: string;
};

export const TAL: Talent[] = [
  { id: "t1", n: "Valeria Ospina", h: "@valeospina", c: ["Moda", "Lifestyle"], p: "IG · TikTok", r: "420K", v: 1, b: "Barranquilla" },
  { id: "t2", n: "Andrés Mejía", h: "@andresmeji", c: ["Música", "Cultura"], p: "TikTok · YT", r: "310K", v: 2, b: "Bogotá" },
  { id: "t3", n: "Laura Castaño", h: "@lauracast", c: ["Bienestar"], p: "IG · YT", r: "188K", v: 3, b: "Medellín" },
  { id: "t4", n: "Kevin Rojas", h: "@kevrojas", c: ["Humor", "Ciudad"], p: "TikTok", r: "760K", v: 4, b: "Cali" },
  { id: "t5", n: "Sara Villamil", h: "@saravmil", c: ["Emprendimiento"], p: "IG · LinkedIn", r: "95K", v: 2, b: "Barranquilla" },
  { id: "t6", n: "Juan D. Peña", h: "@jdpena", c: ["Tecnología"], p: "YT · IG", r: "240K", v: 1, b: "Bogotá" },
  { id: "t7", n: "Mariana Ríos", h: "@marianarios", c: ["Arte", "Fotografía"], p: "IG", r: "132K", v: 3, b: "Cartagena" },
  { id: "t8", n: "Tomás Herrera", h: "@tomasherr", c: ["Deporte", "Lifestyle"], p: "TikTok · IG", r: "405K", v: 4, b: "Barranquilla" },
];

export const MR_CATS: string[] = [
  "Bullying",
  "Autoestima",
  "Ansiedad",
  "Depresión",
  "Presión social",
  "Relaciones",
  "Soledad",
  "Redes y comparación",
  "Propósito",
  "Familia",
  "Vida universitaria",
];

export const MR_ARTS: { t: string; c: string; r: number; v: number }[] = [
  { t: "Cuando el bullying se mudó al celular y ya no puedes cerrar la puerta", c: "Bullying", r: 5, v: 1 },
  { t: "No eres flojo: así se ve la depresión a los 19", c: "Depresión", r: 7, v: 2 },
  { t: "Comparar tu día normal con el mejor día de otra persona", c: "Redes y comparación", r: 4, v: 3 },
  { t: "Guía práctica: qué decir cuando un amigo te dice que está mal", c: "Relaciones", r: 6, v: 4 },
  { t: "La presión de tener la vida resuelta antes de los 25", c: "Presión social", r: 5, v: 2 },
  { t: "Historias reales: le conté a mi mamá que iba a terapia", c: "Familia", r: 8, v: 3 },
];

// Líneas de ayuda — README sección 5: "Renzo debe validarlos con las
// secretarías de salud antes de publicar y revisarlos cada 6 meses.
// Un número desactualizado en una pantalla de crisis es peor que no
// tener la pantalla."
export const LINES: { n: string; t: string; s: string; tel: string }[] = [
  { n: "106", t: "Línea de salud mental", s: "Escucha, apoyo inicial y orientación profesional. Gratuita, confidencial, 24/7. Desde fijo o celular.", tel: "106" },
  { n: "192", t: "Teleorientación MinSalud — opción 4", s: "Atención inicial, primeros auxilios psicológicos e intervención en crisis. Nacional, 24 horas.", tel: "192" },
  { n: "123", t: "Emergencias", s: "Si hay riesgo inmediato para tu vida o la de alguien más, llama ya.", tel: "123" },
  { n: "141", t: "ICBF — protección a menores", s: "Línea nacional de protección a niños, niñas y adolescentes.", tel: "141" },
];

export const LINES_REG: { n: string; t: string; s: string; tel: string }[] = [
  { n: "Barranquilla", t: "Línea de la Vida", s: "(605) 339 9999 · 24 horas, Barranquilla y área metropolitana.", tel: "6053399999" },
  { n: "Cartagena", t: "Línea de la Vida", s: "(605) 339 9999", tel: "6053399999" },
  { n: "Cartagena", t: "Salud Mental Distrital", s: "315 300 2003", tel: "3153002003" },
];

export const PKS: { n: string; d: string; f: string[]; feat: boolean }[] = [
  { n: "Starter", d: "Para marcas que quieren probar la audiencia.", f: ["1 pieza de branded content", "1 creador del roster", "Distribución en Actualidad", "Reporte de alcance"], feat: false },
  { n: "Growth", d: "Presencia sostenida durante un trimestre.", f: ["4 piezas de branded content", "3 creadores del roster", "Patrocinio de una sección", "Cupón en PAT Deals", "Reporte mensual"], feat: true },
  { n: "Premium", d: "Integración total con la plataforma.", f: ["Serie editorial propia", "Roster completo disponible", "Episodio de podcast patrocinado", "Reto en PAT Challenges", "Insights de audiencia", "Tienda de marca en PAT Market"], feat: false },
  { n: "Launch", d: "Lanzamiento de producto de cero a mercado.", f: ["Estrategia de lanzamiento", "Activación con creadores", "Reportaje especial", "Cobertura en Tendencias", "Evento y contenido en vivo"], feat: false },
];

export const SVCS: [string, string][] = [
  ["Representación de talento", "El roster PAT, con contrato y gestión."],
  ["Branded content", "Contenido editorial, no publicidad disfrazada."],
  ["Publicidad nativa", "Formatos que la audiencia no salta."],
  ["Patrocinio de sección", "Tu marca vive donde vive la conversación."],
  ["Activaciones", "Presencia física con creadores."],
  ["Retos y concursos", "PAT Challenges con tu mecánica."],
  ["Podcast patrocinado", "People Are Talking, con tu marca dentro."],
  ["Reportajes especiales", "Periodismo de marca hecho en serio."],
  ["Insights de audiencia", "Data de lo que esta generación piensa."],
];

// ============================================================
// CHAT — respuestas guionadas. NO hay LLM en vivo.
// Ver README sección 5: la IA se habilita solo con protocolo
// clínico (revisión de salud mental + escalamiento + legal).
// NO conectar OpenAI ni ningún modelo aquí.
// ============================================================
export const RISK =
  /suicid|matarme|me quiero morir|quiero morir|hacerme da[ñn]o|no quiero vivir|cortarme|quitarme la vida|acabar con todo|desaparecer|no aguanto m[aá]s|ayuda urgente/i;

export const SCRIPT: Record<string, string> = {
  "Me siento triste":
    "Gracias por decirlo. Nombrarlo ya es algo.\n\n¿Hace cuánto lo sientes así? A veces ayuda saber si es de estos días o si viene de más atrás.",
  "Estoy sufriendo bullying":
    "Lamento que te esté pasando. Que alguien te trate mal no dice nada de ti, dice todo de quien lo hace.\n\n¿Está pasando en el colegio, la universidad o en redes? ¿Hay algún adulto que ya lo sepa?",
  "Tengo ansiedad":
    "Ok. Vamos despacio.\n\nAntes de hablar de por qué: ¿puedes hacer algo por mí ahora? Respira contando 4 al inhalar, 6 al exhalar. Tres veces. Te espero.",
  "Quiero hablar con alguien":
    "Eso es una buena decisión y no es fácil tomarla.\n\nPuedo mostrarte el directorio de profesionales y las líneas gratuitas de atención. También puedes seguir aquí conmigo el tiempo que quieras.",
  "Necesito ayuda urgente": "__CRISIS__",
  "Quiero mejorar mi autoestima":
    "Ese trabajo no es rápido, pero sí se puede.\n\n¿Qué es lo primero que te dices a ti mismo cuando algo te sale mal? Empecemos por ahí.",
};

export const FALLBACK: string[] = [
  "Te leo. Cuéntame un poco más — no hay prisa.",
  "Eso suena pesado de cargar. ¿Hay alguien en tu vida que sepa que te sientes así?",
  "Gracias por confiarme esto. ¿Qué crees que te ayudaría hoy, aunque sea algo pequeño?",
  "Tiene sentido que te sientas así. ¿Quieres que te muestre recursos donde puedes hablar con un profesional?",
];

export const STUBS: Record<string, [string, string]> = {
  entrevistas: ["Entrevistas", "Historias reales que inspiran y conectan."],
  podcast: ["People Are Talking Podcast", "Cinco episodios grabados, en montaje."],
  planes: ["Qué hacer", "Lugares, eventos y experiencias para moverte."],
  marketplace: ["PAT Market", "Comercio curado de emprendimientos y marcas independientes."],
  cupones: ["PAT Deals", "Descuentos exclusivos de marcas aliadas."],
  concursos: ["PAT Challenges", "Retos, convocatorias y giveaways."],
  terminos: ["Términos y condiciones", "Pendiente de revisión legal."],
  privacidad: ["Política de privacidad", "Pendiente de revisión legal — Ley 1581 de 2012."],
  cookies: ["Política de cookies", "Pendiente de revisión legal."],
};
