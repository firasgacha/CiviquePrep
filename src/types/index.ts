export interface Question {
  num: number;
  text: string;
  options: string[];
  correct: string;
  theme: number;
  id: string;
  revealed?: boolean;
  type?: "connaissance" | "mise en situation";
}

export type Tab = "train" | "exam";

export interface ExamState {
  active: boolean;
  finished: boolean;
  questions: Question[];
  answers: (string | null)[];
  index: number;
  timer: number;
}

export interface UserSelections {
  [key: string]: string;
}

export const THEME_NAMES: { [key: number]: string } = {
  0: "Tous",
  1: "Principes",
  2: "Institutions",
  3: "Droits & devoirs",
  4: "Histoire & culture",
  5: "Vie sociale",
};
