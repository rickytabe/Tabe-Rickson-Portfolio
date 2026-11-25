// Algo's questions for CSC207 CA 2024 (public: no answers here).
// Answers and explanations live server-side in src/lib/quiz/answers-csc207ca24.ts. The correct option
// is always listed first there; the quiz shuffles the options. Keep ids stable: stats use them.
import type { QuizQuestion } from "@/app/algorithms-made-easy-csc207/quiz-questions";

export const CSC207CA24_QUESTIONS: QuizQuestion[] = [
  { id: "y1", chapter: "a1a", q: "reverseList() should start its loop at which index?", options: ["list->size - 1", "0", "list->size", "MAX"] },
  { id: "y2", chapter: "a1a", q: "Reversing the display of 2, 3, 10, 23, 50 gives…", options: ["50, 23, 10, 3, 2", "2, 3, 10, 23, 50", "50, 2, 23, 3, 10", "2, 50, 3, 23, 10"] },
  { id: "y3", chapter: "a1b", q: "The main disadvantage of an array is…", options: ["Its size is fixed in advance", "It can only hold strings", "It is stored on disk", "It cannot be read in a loop"] },
  { id: "y4", chapter: "a1c", q: "The main advantage of a file over an array is…", options: ["Its data stays after the program ends", "It is faster to read", "It has a fixed size", "It needs no name"] },
  { id: "y5", chapter: "a2a", q: "today = 3 and case 3 prints \"mathematics\" then breaks. Output?", options: ["mathematics", "3", "mathematics then 3", "programing"] },
  { id: "y6", chapter: "a2b", q: "for(j=1; j<10; j=j+1) println(i); with i = 1. How many lines of 1?", options: ["9", "10", "1", "8"] },
  { id: "y7", chapter: "a2c", q: "n = 8, and i is printed with printf(i) when i%2 == 0. Output?", options: ["2468", "2 4 6 8 on four lines", "1357", "02468"] },
  { id: "y8", chapter: "a2d", q: "for(k=1; k<20; k+=4) with k++ inside and continue when k%4 == 0. What does the last println(k) print?", options: ["20", "17", "16", "21"] },
  { id: "y9", chapter: "b1", q: "The customer gets the PIN wrong three times. The machine…", options: ["Ends without ejecting the card", "Ejects the card", "Asks for a fourth try", "Shows the balance"] },
  { id: "y10", chapter: "b1", q: "Which flow construct fits the three tries at the PIN?", options: ["Iteration (a loop)", "Sequence only", "A switch", "No construct is needed"] },
];
