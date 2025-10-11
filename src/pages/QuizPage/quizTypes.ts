export interface QuizItem {
  id: number;
  question: string;
  image: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizCategory {
  id: number;
  title: string;
  items: QuizItem[];
}
