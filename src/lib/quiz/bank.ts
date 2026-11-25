// Server-only: every book's quiz questions with their answers. Never import from a client component.
import type { BookInfo } from "@/lib/books";
import { QUIZ_QUESTIONS as CSC207_QUESTIONS, type QuizQuestion } from "@/app/algorithms-made-easy-csc207/quiz-questions";
import { CSC211_QUESTIONS } from "@/app/csc211-tutorial-solutions/quiz-questions";
import { CSC207T_QUESTIONS } from "@/app/csc207-tutorial-solutions/quiz-questions";
import { CSC207TEST1_QUESTIONS } from "@/app/csc207-ca-2024-solutions/quiz-questions";
import { QUIZ_ANSWERS as CSC207_ANSWERS } from "./answers";
import { CSC211_ANSWERS } from "./answers-csc211";
import { CSC207T_ANSWERS } from "./answers-csc207t";
import { CSC207TEST1_ANSWERS } from "./answers-csc207test1";

export type QuizAnswer = { answer: number; explain: string };
export type QuizBank = { questions: QuizQuestion[]; answers: Record<string, QuizAnswer> };

const BANKS: Record<BookInfo["id"], QuizBank> = {
  csc207: { questions: CSC207_QUESTIONS, answers: CSC207_ANSWERS },
  csc211: { questions: CSC211_QUESTIONS, answers: CSC211_ANSWERS },
  csc207t: { questions: CSC207T_QUESTIONS, answers: CSC207T_ANSWERS },
  csc207test1: { questions: CSC207TEST1_QUESTIONS, answers: CSC207TEST1_ANSWERS },
};

export function quizBank(book: BookInfo): QuizBank {
  return BANKS[book.id];
}
