export interface QuizItem {
  id: number;
  /** Backend UUID for deterministic grading (quiz_question.id). */
  backendQuestionId?: string;
  question: string;
  image: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizCategory {
  id: number;
  title: string;
  items: QuizItem[];
}
