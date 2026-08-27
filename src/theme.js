// Design tokens for PesaRate's "Exchange Bureau" visual language:
// a currency/travel-document aesthetic (banknote colour-coding, ticket
// perforations, departure-board ticker) instead of a generic SaaS dashboard.
export const theme = {
  color: {
    ink: "#0b1614",
    inkSoft: "#12211d",
    paper: "#f4f1e6",
    paperDim: "#e9e4d2",
    marigold: "#f2b84b", // benchmark / neutral data
    coral: "#ff6b5e",    // down / alert
    lime: "#c6f135",     // primary action / up
    line: "rgba(244, 241, 230, 0.14)",
  },
  font: {
    display: "'Fraunces', serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radius: {
    ticket: "22px",
    pill: "9999px",
  },
};

export default theme;
