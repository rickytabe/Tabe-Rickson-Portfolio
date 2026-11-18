// Plain book details, safe to import from client components (no Node APIs here).
export const BOOK_PATH = "/algorithms-made-easy-csc207";
export const BOOK_AUTHOR = "Tabe Rickson";
export const BOOK_AUTHOR_AVATAR = "/authors/tabe-rickson.webp";
export const BOOK_CHAPTERS = 24;

// Sidebar labels: plain topic names, so readers can find a syllabus topic at a glance. The chapters
// keep their own friendlier headings in the text. Keyed by chapter id.
export const TOPIC_LABELS: Record<string, string> = {
  c1: "What is an algorithm?",
  c2: "Properties of an algorithm",
  c3: "Problem difficulty",
  c4: "Variables and assignment",
  c5: "Data types",
  c6: "Data structures",
  c7: "Algorithm vs program vs language",
  c8: "The programming process",
  c9: "Pseudocode",
  c10: "Flowcharts",
  c11: "Control structures",
  c12: "Worked examples: sequence and selection",
  c13: "Factorial (steps, pseudocode, C)",
  c14: "Euclid's algorithm (GCD)",
  c15: "Top-down and bottom-up design",
  c16: "Greedy algorithms",
  c17: "Divide and conquer",
  c18: "Dynamic programming",
  c19: "Other algorithm types",
  c20: "Time complexity",
  c21: "Space complexity",
  c22: "Best, worst and average case",
  c23: "Big O notation",
  c24: "Exam revision summary",
};
