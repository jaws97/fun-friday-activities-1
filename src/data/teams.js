export const TEAM_COLORS = [
  "#E4374F", "#2F9BD6", "#EE8F1F", "#2FBF71", "#9A5BE8",
  "#2AB9A9", "#E85B92", "#A9C23F", "#6C7BFF", "#C97F45",
];

/* Ten teams of five for a fifty-player room. */
export const DEFAULT_TEAMS = [
  "Thor: God of Blunder",
  "Toy Story Points",
  "No Way Home Before 9",
  "Hakuna Ma-Data",
  "Elsa from Electronic City",
  "Game of Phones",
  "Lord of the Onion Rings",
  "The Devil Wears Formals",
  "Mission Impossible: Logging Off",
  "Fast & Furious: Bellandur Drift",
].map((name, i) => ({ id: i, name, points: 0, color: TEAM_COLORS[i] }));

/* Bench teams the host can add one by one when the crowd outgrows ten. */
export const RESERVE_TEAMS = [
  { name: "Pirates of the Cubicle", color: "#D4A017" },
  { name: "Finding Wi-Fi", color: "#4FB3E8" },
];
