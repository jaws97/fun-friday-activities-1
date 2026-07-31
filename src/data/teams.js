export const TEAM_COLORS = ["#E4374F", "#2F9BD6", "#EE8F1F", "#2FBF71", "#9A5BE8"];

export const DEFAULT_TEAMS = [
  "Thor: God of Blunder",
  "Toy Story Points",
  "No Way Home Before 9",
  "Hakuna Ma-Data",
  "Elsa from Electronic City",
].map((name, i) => ({ id: i, name, points: 0, color: TEAM_COLORS[i] }));

/* Bench teams the host can add one by one when the crowd outgrows five. */
export const RESERVE_TEAMS = [
  { name: "Game of Phones", color: "#2AB9A9" },
  { name: "Lord of the Onion Rings", color: "#E85B92" },
  { name: "The Devil Wears Formals", color: "#A9C23F" },
  { name: "Mission Impossible: Logging Off", color: "#6C7BFF" },
  { name: "Fast & Furious: Bellandur Drift", color: "#C97F45" },
];
