// Server-only: correct option (index into the question's `options`) and explanation per id, for
// CSC207 CA 2024. Never import this from a client component.

export const CSC207CA24_ANSWERS: Record<string, { answer: number; explain: string }> = {
  y1: { answer: 0, explain: "The last element sits at size - 1. Walk back from there to 0." },
  y2: { answer: 0, explain: "Display from the last element to the first: 50, 23, 10, 3, 2." },
  y3: { answer: 0, explain: "MAX is chosen before the program runs, so an array cannot grow and unused places waste memory." },
  y4: { answer: 0, explain: "A file is stored on disk, so its data is still there after the program stops. An array is lost." },
  y5: { answer: 0, explain: "case 3 matches, prints mathematics, and break leaves the switch before default." },
  y6: { answer: 0, explain: "j takes 1 to 9: nine rounds. Then println() prints an empty line." },
  y7: { answer: 0, explain: "The even numbers 2, 4, 6, 8 are printed, and printf does not end the line, so they run together: 2468." },
  y8: { answer: 0, explain: "k goes 1, 6, 11, 16; at 16 continue skips to k = 20, the loop ends, and println(k) prints 20." },
  y9: { answer: 0, explain: "The paper says: wrong three times, the whole process ends without ejecting the card." },
  y10: { answer: 0, explain: "Repeating the PIN entry up to three times is iteration: a while loop with a counter." },
};
