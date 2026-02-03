export enum QuestionType {
  MCQ = 'MCQ',
  SA = 'SA', // Short Answer
  NAT = 'NAT' // Numeric Answer
}

export enum QuestionStatus {
  NOT_VISITED = 'NOT_VISITED',
  VISITED = 'VISITED',
  ANSWERED = 'ANSWERED',
  MARKED_FOR_REVIEW = 'MARKED_FOR_REVIEW',
  ANSWERED_AND_MARKED = 'ANSWERED_AND_MARKED'
}

export interface Option {
  index: string;
  label: string;
  html: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  html: string;
  options?: Option[];
  correctAnswer: string;
  marks: number;
  sourceFile: string;
  imagePaths?: string[];
}

export interface UserResponse {
  questionId: string;
  answer: string | null;
  timeSpent: number;
  status: QuestionStatus;
}

export interface TestResult {
  isPractice: boolean; // New flag
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  score: number;
  totalMarks: number; // Total marks of all questions in the set
  totalAttemptedMarks: number; // New: Total possible marks of only questions answered
  accuracy: number;
  timeTaken: number;
  questionAnalysis: {
    question: Question;
    userAnswer: string | null;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}