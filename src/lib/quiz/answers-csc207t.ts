// Server-only: correct option (index into the question's `options`) and explanation per id, for
// CSC207 Tutorial Sheet Solutions. Never import this from a client component.

export const CSC207T_ANSWERS: Record<string, { answer: number; explain: string }> = {
  t1: { answer: 0, explain: "An ordered set stays sorted: elements bigger than val each move one step right, and val drops into the gap." },
  t2: { answer: 0, explain: "A set keeps no duplicates, so Insert checks first and does nothing when val is already there." },
  t3: { answer: 0, explain: "Insert every element of both sets into an empty one. The duplicate 2 is skipped, giving {1, 2, 3, 4, 5}." },
  t4: { answer: 0, explain: "Compare the two ends and walk inward. One mismatch means no; meeting in the middle with none means yes." },
  t5: { answer: 0, explain: "% gives the remainder. Even numbers leave remainder 0 when divided by 2." },
  t6: { answer: 0, explain: "Once score >= 80 has failed, the next test only needs >= 70: the upper limit is already guaranteed." },
  t7: { answer: 0, explain: "Compare a and b, then compare the winner with c: two comparisons whichever path you take." },
  t8: { answer: 0, explain: "2000 is divisible by 400, so it is a leap year. 1900 and 2100 are divisible by 100 but not 400." },
  t9: { answer: 0, explain: "Test the most specific rule first: 400, then 100, then 4. Otherwise 1900 would wrongly pass the 4 test." },
  t10: { answer: 0, explain: "BMI = weight in kg divided by height in metres, squared." },
  t11: { answer: 0, explain: "Without break, execution falls through into the next case. break leaves the switch." },
  t12: { answer: 0, explain: "\"18 and above\" includes 18, so it is >=, not >." },
  t13: { answer: 0, explain: "A known number of repetitions is the job of a for loop: start, stop and step in one line." },
  t14: { answer: 0, explain: "Adding 0 changes nothing, so a sum starts at 0." },
  t15: { answer: 0, explain: "Multiplying by 1 changes nothing; starting at 0 would make every product 0." },
  t16: { answer: 0, explain: "n % 10 is the last digit (4); n / 10 drops it (123)." },
  t17: { answer: 0, explain: "Keep going while digits are left (while temp > 0): the digit count isn't known before you start." },
  t18: { answer: 0, explain: "Each term is the sum of the two before it: 0, 1, 1, 2, 3, 5." },
  t19: { answer: 0, explain: "If n = a × b, one of them is at most √n, so testing i while i * i <= n is enough." },
  t20: { answer: 0, explain: "Outer loop for rows, inner loop prints i stars on row i, then one println moves down." },
  t21: { answer: 0, explain: "The switch jumps to case 3, prints, and break leaves before default." },
  t22: { answer: 0, explain: "j takes 1, 3, 5, 7, 9: five rounds. At 11 the test j < 10 fails." },
  t23: { answer: 0, explain: "printf prints without a line break, which is why Exercise IV(c) prints 2468 on one line." },
  t24: { answer: 0, explain: "continue skips the rest of this round and goes on to the next one. break is the one that leaves the loop." },
};
