// Quiz bot questions for CSC207 Made Easy (public: no answers here).
// Answers and explanations live server-side in src/lib/quiz/answers.ts, so the leaderboard
// can't be gamed by reading the page's code. Keep ids stable: stats and the board use them.

export type QuizQuestion = {
  id: string;
  chapter: string; // chapter id, e.g. "c11"
  q: string;
  options: [string, string, string, string];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    chapter: "c1",
    q: "Which statement about algorithms and programs is correct?",
    options: [
      "Every program is an algorithm, but not every algorithm is a program",
      "Every algorithm is a program",
      "Algorithms and programs are exactly the same thing",
      "A program is an algorithm that is allowed to run forever",
    ],
  },
  {
    id: "q2",
    chapter: "c1",
    q: "Which is the best definition of an algorithm?",
    options: [
      "A finite set of explicit, unambiguous steps that produce output and terminate in finite time",
      "Any piece of code written in a programming language",
      "A set of steps that may keep running if the problem is hard",
      "A diagram showing how data flows between systems",
    ],
  },
  {
    id: "q3",
    chapter: "c2",
    q: "How many outputs must an algorithm produce?",
    options: ["One or more", "Zero or more", "Exactly one", "None, if it takes no input"],
  },
  {
    id: "q4",
    chapter: "c2",
    q: "A recipe step says \"add some salt\". Which property of an algorithm does it break?",
    options: ["Definiteness", "Finiteness", "Effectiveness", "Input"],
  },
  {
    id: "q5",
    chapter: "c2",
    q: "A step that says \"divide 10 by 0\" breaks which property?",
    options: ["Effectiveness", "Definiteness", "Output", "Finiteness"],
  },
  {
    id: "q6",
    chapter: "c2",
    q: "An algorithm contains a loop that never stops. Which property is missing?",
    options: ["Finiteness", "Effectiveness", "Definiteness", "Input"],
  },
  {
    id: "q7",
    chapter: "c3",
    q: "Which of these problems sits highest on the difficulty ladder?",
    options: [
      "Factoring a huge composite number",
      "Finding the biggest value in a list",
      "Sorting a list",
      "Adding two numbers",
    ],
  },
  {
    id: "q8",
    chapter: "c4",
    q: "What does the assignment x ← x + 1 do?",
    options: [
      "Reads the current value of x, adds 1, and stores the result back in x",
      "Checks whether x is equal to x + 1",
      "Sets x to 1",
      "Causes an error, because x can never equal x + 1",
    ],
  },
  {
    id: "q9",
    chapter: "c5",
    q: "What is a data type?",
    options: [
      "A set of values together with the operations allowed on them",
      "The memory address where a value is stored",
      "A way of organising data so it can be used efficiently",
      "The name you give a variable",
    ],
  },
  {
    id: "q10",
    chapter: "c6",
    q: "After a party you wash the top plate on the pile first. Which data structure works like this?",
    options: ["Stack", "Queue", "Tree", "Graph"],
  },
  {
    id: "q11",
    chapter: "c6",
    q: "The line at the bank, where the first person in is the first served, behaves like a:",
    options: ["Queue", "Stack", "Tree", "Array"],
  },
  {
    id: "q12",
    chapter: "c6",
    q: "The road network around Buea, where many roads meet and you can drive in a circle, is best modelled as a:",
    options: ["Graph", "Tree", "Stack", "Queue"],
  },
  {
    id: "q13",
    chapter: "c7",
    q: "When a compiler accepts your program, what has it actually checked?",
    options: [
      "Only the syntax (the form), not whether the program means the right thing",
      "Only the semantics (the meaning)",
      "Both form and meaning, so the program must be correct",
      "Neither; compilers only translate",
    ],
  },
  {
    id: "q14",
    chapter: "c8",
    q: "Which stage comes first in the programming process?",
    options: ["Define the problem", "Implement (write the code)", "Test", "Document"],
  },
  {
    id: "q15",
    chapter: "c9",
    q: "What is pseudocode?",
    options: [
      "A structured, informal way of writing an algorithm, between plain English and real code",
      "A programming language that compiles to machine code",
      "A type of flowchart",
      "The binary instructions a processor runs",
    ],
  },
  {
    id: "q16",
    chapter: "c10",
    q: "In a flowchart, which shape represents a decision?",
    options: ["Diamond", "Rectangle", "Oval", "Circle"],
  },
  {
    id: "q17",
    chapter: "c10",
    q: "In a flowchart, what does an oval represent?",
    options: ["Start or end", "A process step", "A decision", "A subprogram"],
  },
  {
    id: "q18",
    chapter: "c11",
    q: "An IF ... THEN ... ELSE statement is an example of which structure?",
    options: ["Selection", "Sequence", "Repetition", "Subprogram"],
  },
  {
    id: "q19",
    chapter: "c11",
    q: "What is the key difference between a WHILE loop and a REPEAT UNTIL loop?",
    options: [
      "REPEAT UNTIL always runs its body at least once; WHILE may run zero times",
      "WHILE always runs its body at least once; REPEAT UNTIL may run zero times",
      "Both test their condition before running the body",
      "There is no difference except the keywords",
    ],
  },
  {
    id: "q20",
    chapter: "c12",
    q: "A driver reacting to red, amber or green at a traffic light is an example of:",
    options: ["Multi-way selection", "Binary selection", "Sequence", "Repetition"],
  },
  {
    id: "q21",
    chapter: "c13",
    q: "When an algorithm computes a factorial by repeated multiplication, what should the accumulator start at?",
    options: ["1", "0", "n", "It does not matter"],
  },
  {
    id: "q22",
    chapter: "c14",
    q: "What does Euclid's algorithm find?",
    options: [
      "The greatest common divisor of two numbers",
      "The least common multiple of two numbers",
      "The prime factors of a number",
      "The square root of a number",
    ],
  },
  {
    id: "q23",
    chapter: "c14",
    q: "In Euclid's algorithm, when do you stop?",
    options: [
      "When the remainder becomes 0",
      "When both numbers become 1",
      "After exactly ten steps",
      "When the remainder is larger than the divisor",
    ],
  },
  {
    id: "q24",
    chapter: "c15",
    q: "Which describes the top-down design approach?",
    options: [
      "Start from the whole problem and break it into smaller and smaller modules",
      "Design the most primitive components first, then work up",
      "Write the code first and design afterwards",
      "Test every possible input before designing",
    ],
  },
  {
    id: "q25",
    chapter: "c16",
    q: "What does a greedy algorithm do?",
    options: [
      "Takes the best-looking choice at each step and never reconsiders it",
      "Tries every possible combination and picks the best",
      "Stores answers to subproblems in a table to reuse them",
      "Splits the problem into independent halves and merges the answers",
    ],
  },
  {
    id: "q26",
    chapter: "c17",
    q: "How do divide and conquer and dynamic programming differ?",
    options: [
      "In divide and conquer the subproblems are independent; in dynamic programming they overlap",
      "Divide and conquer uses a table; dynamic programming does not",
      "Dynamic programming never uses recursion",
      "They are two names for the same technique",
    ],
  },
  {
    id: "q27",
    chapter: "c18",
    q: "Dynamic programming is best summarised as:",
    options: [
      "Recursion + memoization",
      "Greedy choice + backtracking",
      "Iteration + sorting",
      "Divide and conquer + parallelism",
    ],
  },
  {
    id: "q28",
    chapter: "c19",
    q: "SQL describes what result you want rather than how to compute it. That makes SQL:",
    options: ["Declarative", "Procedural", "Non-deterministic", "Approximate"],
  },
  {
    id: "q29",
    chapter: "c20",
    q: "The key statement sits inside two nested loops, each running n times. About how many times does it run?",
    options: ["n²", "2n", "n", "log n"],
  },
  {
    id: "q30",
    chapter: "c21",
    q: "Which of these belongs to the variable part of space complexity?",
    options: [
      "The recursion stack",
      "Simple variables",
      "Fixed-size variables",
      "Space that stays the same whether n is 5 or 5 million",
    ],
  },
  {
    id: "q31",
    chapter: "c22",
    q: "For a linear search, when does the best case happen?",
    options: [
      "When the item you want is the first one in the list",
      "When the item is the last one in the list",
      "When the item is not in the list at all",
      "When the list is sorted in reverse order",
    ],
  },
  {
    id: "q32",
    chapter: "c23",
    q: "Big O notation usually describes which case?",
    options: ["The worst case", "The best case", "The average case", "Only the memory used"],
  },
  {
    id: "q33",
    chapter: "c23",
    q: "Pushing or popping on a stack takes the same time whether it holds 3 items or 300. That is:",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
  },
  {
    id: "q34",
    chapter: "c23",
    q: "Binary search repeatedly halves the data. What is its growth?",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
  },
  {
    id: "q35",
    chapter: "c23",
    q: "Which of these grows fastest as n gets large?",
    options: ["O(n²)", "O(n log n)", "O(log n)", "O(1)"],
  },
];
