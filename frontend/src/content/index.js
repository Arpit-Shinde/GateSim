export const chapters = [
  {
    id: "basic-gates",
    title: "Basic Gates",
    description: "AND, OR, NOT, and their truth tables",
    // lazy-loaded via dynamic import
    load: () => import("./ch01-basic-gates"),
    tags: ["logic", "basics"],
  },
  {
    id: "combinational",
    title: "Combinational Circuits",
    description: "Half adders, truth tables, and logic implementation",
    // lazy-loaded via dynamic import
    load: () => import("./ch02-combinational"),
    tags: ["logic", "combinational"],
  },
];