// Algo's questions for CSC207 Tutorial Sheet Solutions (public: no answers here).
// Answers and explanations live server-side in src/lib/quiz/answers-csc207t.ts. The correct option
// is always listed first there; the quiz shuffles the options. Keep ids stable: stats use them.
// `chapter` is the question on the sheet where the idea is used, so "Read question II.5" goes there.
import type { QuizQuestion } from "@/app/algorithms-made-easy-csc207/quiz-questions";

export const CSC207T_QUESTIONS: QuizQuestion[] = [
  { id: "t1", chapter: "s1-e1-1a", q: "Inserting into an ORDERED set, what must happen before val is placed?", options: ["Bigger elements shift one place right", "val is added at the end, then the set is reversed", "Every element shifts one place left", "Nothing: a set keeps elements in any order"] },
  { id: "t2", chapter: "s1-e1-1a", q: "Insert(5) into the set {1, 3, 5, 7}. What happens?", options: ["Nothing: 5 is already there", "5 is added again: {1, 3, 5, 5, 7}", "5 replaces 7", "The set becomes {5}"] },
  { id: "t3", chapter: "s1-e1-1b", q: "Union({1,2,3}, {2,4,5}) using Insert() gives…", options: ["{1, 2, 3, 4, 5}", "{1, 2, 2, 3, 4, 5}", "{2}", "{1, 3, 4, 5}"] },
  { id: "t4", chapter: "s1-e1-2", q: "isPalindrome compares word[left] and word[right]. When does it stop with \"yes\"?", options: ["When left and right meet or cross with no mismatch", "After comparing every pair twice", "As soon as one pair matches", "When left reaches n"] },
  { id: "t5", chapter: "s1-e2-1", q: "Which test says n is even?", options: ["n % 2 == 0", "n / 2 == 0", "n % 2 == 1", "n * 2 == n"] },
  { id: "t6", chapter: "s1-e2-2", q: "Why test grade bands from the highest down (>= 80, then >= 70, …)?", options: ["Each later test can skip the upper limit already ruled out", "Because if statements must go from big to small", "It makes the program run faster in a loop", "So that a score of 100 gets grade F"] },
  { id: "t7", chapter: "s1-e2-3", q: "With nested branching, how many comparisons find the largest of three numbers?", options: ["2 on every path", "3 on every path", "1", "6"] },
  { id: "t8", chapter: "s1-e2-5", q: "Which year is a leap year?", options: ["2000", "1900", "2023", "2100"] },
  { id: "t9", chapter: "s1-e2-5", q: "In the leap year checker, which divisibility test must come first?", options: ["by 400", "by 4", "by 100", "by 2"] },
  { id: "t10", chapter: "s1-e2-6", q: "BMI = …", options: ["weight ÷ height²", "height ÷ weight²", "weight × height", "weight ÷ height"] },
  { id: "t11", chapter: "s1-e2-8", q: "In a switch, what does break after a case do?", options: ["Leaves the switch, so the next case doesn't run too", "Stops the whole program", "Jumps to default", "Repeats the case"] },
  { id: "t12", chapter: "s1-e2-9", q: "\"Eligible to vote at 18 and above\" is the test…", options: ["age >= 18", "age > 18", "age == 18", "age <= 18"] },
  { id: "t13", chapter: "s1-e3-1", q: "You know you must repeat exactly 10 times. Which loop fits best?", options: ["for", "while (true)", "switch", "if"] },
  { id: "t14", chapter: "s1-e3-2", q: "A running sum should start at…", options: ["0", "1", "N", "-1"] },
  { id: "t15", chapter: "s1-e3-3", q: "A running product (like factorial) should start at…", options: ["1", "0", "n", "-1"] },
  { id: "t16", chapter: "s1-e3-6", q: "To reverse 1234, which operation gives its last digit?", options: ["1234 % 10", "1234 / 10", "1234 * 10", "1234 - 10"] },
  { id: "t17", chapter: "s1-e3-6", q: "Why does Reverse a Number use a while loop rather than a for loop?", options: ["You don't know in advance how many digits there are", "for loops can't use %", "while loops are always faster", "for loops can't go down"] },
  { id: "t18", chapter: "s1-e3-7", q: "Starting at 0, 1, what are the first 6 Fibonacci numbers?", options: ["0, 1, 1, 2, 3, 5", "0, 1, 2, 3, 4, 5", "1, 1, 2, 3, 5, 8", "0, 1, 1, 2, 4, 8"] },
  { id: "t19", chapter: "s1-e3-8", q: "Checking if n is prime, the divisor loop can stop when…", options: ["i * i > n", "i > n", "i > n / 2 always", "i reaches 10"] },
  { id: "t20", chapter: "s1-e3-9", q: "Printing a right-angled triangle of stars needs…", options: ["Nested loops: rows outside, stars on a row inside", "One loop and a switch", "A single while loop", "No loop, just print"] },
  { id: "t21", chapter: "s1-e4-a", q: "today = 3. A switch has case 3 with break, and default. What runs?", options: ["Only case 3", "case 3 and default", "Only default", "Every case from 1 to 3"] },
  { id: "t22", chapter: "s1-e4-b", q: "for(j=1; j<10; j=j+2): how many times does the body run?", options: ["5", "10", "9", "4"] },
  { id: "t23", chapter: "s1-e4-c", q: "What is the difference between printf(i) and println(i) on the sheet?", options: ["printf doesn't end the line", "printf adds a space", "println doesn't print numbers", "There is no difference"] },
  { id: "t24", chapter: "s1-e4-d", q: "Inside a loop, what does continue do?", options: ["Skips to the next round of the loop", "Leaves the loop", "Restarts the program", "Prints the loop variable"] },
];
