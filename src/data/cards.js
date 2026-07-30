export const WILD_GRADIENT = "linear-gradient(135deg,#E4374F 0%,#EE8F1F 25%,#2FBF71 50%,#2F9BD6 75%,#9A5BE8 100%)";

export const CARD_TYPES = [
  { type: "skip", label: "SKIP", color: "#2FBF71", verdict: "Saved. No drink. Live to scroll another day." },
  { type: "reverse", label: "REV", color: "#EE8F1F", verdict: "The HOST drinks. Justice." },
  { type: "plus2", label: "+2", color: "#E4374F", verdict: "Drawer picks ONE teammate. Both drink." },
  { type: "plus4", label: "+4", color: "#9A5BE8", verdict: "ENTIRE TEAM DRINKS. No mercy." },
  { type: "wild", label: "WILD", color: WILD_GRADIENT, verdict: "Transfer the penalty. Drawer picks ANY rival team to drink instead." },
];
