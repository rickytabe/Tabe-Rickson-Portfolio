// Algo's questions for CSC207 Test 1 Solutions (public: no answers here).
// Answers and explanations live server-side in src/lib/quiz/answers-csc207test1.ts. The correct option
// is always listed first there; the quiz shuffles the options. Keep ids stable: stats use them.
import type { QuizQuestion } from "@/app/algorithms-made-easy-csc207/quiz-questions";

export const CSC207TEST1_QUESTIONS: QuizQuestion[] = [
  { id: "x1", chapter: "a1", q: "initSet() must clear the ordered set. Which line does it?", options: ["set->size = 0;", "set->data[0] = 0;", "set->size = MAX_SIZE;", "return false;"] },
  { id: "x2", chapter: "a1", q: "In contains(), what goes inside the for loop?", options: ["if (set->data[i] == value) return true;", "return set->data[i] == value;", "if (set->data[i] != value) return false;", "set->size++;"] },
  { id: "x3", chapter: "a2", q: "isPalindrome starts by comparing which two characters?", options: ["elements[0] and elements[length - 1]", "elements[0] and elements[1]", "elements[length] and elements[0]", "Only the middle one"] },
  { id: "x4", chapter: "a2", q: "isPalindrome(\"grace\") returns…", options: ["false: g and e differ", "true", "false: it has 5 letters", "true: it ends with a vowel"] },
  { id: "x5", chapter: "a3a", q: "today = 5 and the switch has cases 1, 2, 3 and default: print(today). Output?", options: ["5", "Nothing", "stay home", "mathematics"] },
  { id: "x6", chapter: "a3b", q: "i = 1; for(j=1; j<10; j=j+2) println(i); then println(j). The last line printed is…", options: ["11", "9", "10", "1"] },
  { id: "x7", chapter: "a3c", q: "i goes from 1 to 10 and is printed when i%3 == 0. Output?", options: ["3, 6, 9", "3, 6, 9, 12", "1, 4, 7, 10", "0, 3, 6, 9"] },
  { id: "x8", chapter: "b1", q: "A student registered 5 courses. What does the program do?", options: ["Tells them to drop the excess courses", "Ranks them as Failed", "Reads their average", "Ends with no output"] },
  { id: "x9", chapter: "b1", q: "avg = 85. Which rank is displayed?", options: ["Very Good", "Excellent", "Good", "Failed"] },
  { id: "x10", chapter: "b1", q: "In the flowchart, which shape holds the test avg > 90 ?", options: ["A diamond (decision)", "A rectangle (process)", "A parallelogram (input/output)", "An oval (start/end)"] },
];
