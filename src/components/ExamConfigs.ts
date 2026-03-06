export type ExamDifficulty = "quick" | "standard" | "intensive" | "custom";

export interface ExamConfig {
  name: string;
  questionCount: number;
  timeLimit: number; // minutes
  questionTypes: { connaissance: number; miseEnSituation: number };
  passingScore: number;
}

export const EXAM_CONFIGS: Record<ExamDifficulty, ExamConfig> = {
  quick: {
    name: "Quick Practice",
    questionCount: 20,
    timeLimit: 15,
    questionTypes: { connaissance: 15, miseEnSituation: 5 },
    passingScore: 60,
  },
  standard: {
    name: "Standard",
    questionCount: 50,
    timeLimit: 35,
    questionTypes: { connaissance: 30, miseEnSituation: 20 },
    passingScore: 60,
  },
  intensive: {
    name: "Intensive",
    questionCount: 80,
    timeLimit: 60,
    questionTypes: { connaissance: 50, miseEnSituation: 30 },
    passingScore: 65,
  },
  custom: {
    name: "Custom",
    questionCount: 30,
    timeLimit: 25,
    questionTypes: { connaissance: 20, miseEnSituation: 10 },
    passingScore: 60,
  },
};
