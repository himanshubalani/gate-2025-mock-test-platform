import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import { loadQuestions } from './util';
import { UserResponse, TestResult, Question, QuestionType } from './types';

enum AppState {
  START,
  QUIZ,
  RESULT
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.START);
  const [result, setResult] = useState<TestResult | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [testDuration, setTestDuration] = useState<number>(0);

  // Load questions on mount
  useEffect(() => {
    const qs = loadQuestions();
    setAllQuestions(qs);
  }, []);

  const handleStart = (duration: number, selectedSources: string[], questionCount: number) => {
    // 1. Filter by source (Mock Test file)
    let filtered = allQuestions.filter(q => selectedSources.includes(q.sourceFile));
    
    // 2. Shuffle
    filtered = filtered.sort(() => Math.random() - 0.5);
    
    // 3. Slice to desired count
    const finalQuestions = filtered.slice(0, Math.min(filtered.length, questionCount));
    
    setActiveQuestions(finalQuestions);
    setTestDuration(duration);
    setAppState(AppState.QUIZ);
  };

  const calculateResult = (responses: UserResponse[], timeTaken: number) => {
    let correct = 0;
    let incorrect = 0;
    let score = 0;
    let totalMarks = 0;
    let totalAttemptedMarks = 0;
    let attempted = 0;

    const questionAnalysis = activeQuestions.map(q => {
      totalMarks += q.marks;
      const response = responses.find(r => r.questionId === q.id);
      const userAnswer = response?.answer || null;
      let isCorrect = false;

      if (userAnswer) {
        attempted++;
        totalAttemptedMarks += q.marks; // Track marks of only attempted questions
        
        // Exact string match (e.g., "A" === "A" or "50" === "50")
        if (userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
          isCorrect = true;
          correct++;
          score += q.marks;
        } else {
          incorrect++;
          // Negative Marking: Only for MCQs
          if (q.type === QuestionType.MCQ) {
              score -= q.marks / 3;
          }
        }
      }

      return { question: q, userAnswer, isCorrect };
    });

    const res: TestResult = {
      isPractice: testDuration === -1,
      totalQuestions: activeQuestions.length,
      attempted, correct, incorrect,
      score: Math.round((score + Number.EPSILON) * 100) / 100,
      totalMarks,
      totalAttemptedMarks,
      accuracy: attempted > 0 ? (correct / attempted) * 100 : 0,
      timeTaken,
      questionAnalysis
    };

    setResult(res);
    setAppState(AppState.RESULT);
  };

  return (
    <div>
      {appState === AppState.START && (
        <StartScreen onStart={handleStart} allQuestions={allQuestions} />
      )}
      {appState === AppState.QUIZ && (
        <QuizView 
          questions={activeQuestions}
          durationSeconds={testDuration}
          onSubmit={calculateResult}
        />
      )}
      {appState === AppState.RESULT && result && (
        <ResultView 
          result={result} 
          onRetake={() => setAppState(AppState.START)} 
          onHome={() => setAppState(AppState.START)}
        />
      )}
    </div>
  );
};

export default App;