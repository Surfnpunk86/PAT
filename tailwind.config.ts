import type { Config } from "tailwindcss";

// Tokens tomados literalmente del README de entrega (sección 3).
// El detalle visual fino de cada componente (grids, ticker, chat, etc.)
// vive en app/globals.css como CSS "a mano", igual que en el prototipo.
// Estos tokens de Tailwind quedan disponibles para cualquier componente
// nuevo que se construya en el futuro: si necesita color, la respuesta
// es amarillo, negro o hueso — nada más.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pat: {
          black: "#0B0B0B",
          yellow: "#F5E04B",
          bone: "#FAFAF7",
          gray: "#8A8A85",
          line: "#E4E4DF",
          "black-soft": "#171717",
          "line-dark": "#2A2A2A",
        },
        mr: {
          bg: "#F3F1EC",
          deep: "#1F3A34",
          accent: "#7FB09C",
          line: "#DEDACF",
        },
        err: "#C8412F",
        ok: "#2E7D5B",
      },
      fontFamily: {
        display: ["'Archivo Black'", "'Arial Black'", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "10px",
        lg: "18px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
