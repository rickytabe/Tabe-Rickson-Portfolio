// Server-only: correct option (index into the question's `options`) and explanation per id, for
// CSC207 CA 2025. Never import this from a client component.

export const CSC207TEST1_ANSWERS: Record<string, { answer: number; explain: string }> = {
  x1: { answer: 0, explain: "The set holds size elements. Setting size to 0 means it holds none: cleared." },
  x2: { answer: 0, explain: "Return true as soon as you find value. Returning on the first comparison would stop too early." },
  x3: { answer: 0, explain: "Compare the two ends, then move inward: left = 0, right = length - 1." },
  x4: { answer: 0, explain: "The first and last letters, g and e, already differ, so it is not a palindrome." },
  x5: { answer: 0, explain: "No case matches 5, so default runs and prints the value of today." },
  x6: { answer: 0, explain: "j takes 1, 3, 5, 7, 9; the loop stops when j becomes 11, and println(j) prints 11." },
  x7: { answer: 0, explain: "Between 1 and 10, only 3, 6 and 9 are multiples of 3." },
  x8: { answer: 0, explain: "Above four courses, the student is told to drop the excess and register only four." },
  x9: { answer: 0, explain: "85 is not above 90, but it is above 80: Very Good." },
  x10: { answer: 0, explain: "Every yes/no test is a diamond. Rectangles are processes, parallelograms are input and output." },
};
