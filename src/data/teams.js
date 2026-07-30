export const TEAM_COLORS = ["#E4374F", "#2F9BD6", "#EE8F1F", "#2FBF71", "#9A5BE8"];

export const DEFAULT_TEAMS = [
  "Thor: God of Blunder",
  "Toy Story Points",
  "No Way Home Before 9",
  "Hakuna Ma-Data",
  "Elsa from Electronic City",
].map((name, i) => ({ id: i, name, points: 0, color: TEAM_COLORS[i] }));
