import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import { loadQuestions } from './util';
import { UserResponse, TestResult, Question, QuestionType } from './types';
import { Analytics } from "@vercel/analytics/react"; 

enum AppState {
  START,
  QUIZ,
  RESULT
}

// Helper function to check answers
const isAnswerCorrect = (userAns: string, correctAns: string, type: QuestionType): boolean => {
  if (!userAns) return false;
  const cleanUser = userAns.trim().toLowerCase();
  const cleanCorrect = correctAns.trim().toLowerCase();

  if (type === QuestionType.MCQ) {
    if (cleanUser === cleanCorrect) return true;
    return false; 
  } 
  
  if (type === QuestionType.NAT) {
    const userNum = parseFloat(cleanUser);
    if (isNaN(userNum)) return false;

    if (cleanCorrect.includes(',')) {
      const parts = cleanCorrect.split(',').map(s => parseFloat(s.trim()));
      if (parts.length === 2) {
        const min = Math.min(parts[0], parts[1]);
        const max = Math.max(parts[0], parts[1]);
        return userNum >= min && userNum <= max;
      }
    }

    const correctNum = parseFloat(cleanCorrect);
    return Math.abs(userNum - correctNum) < 0.000001;
  }

  return false;
};


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.START);
  const [result, setResult] = useState<TestResult | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [testDuration, setTestDuration] = useState<number>(0);

  useEffect(() => {
    const qs = loadQuestions();
    setAllQuestions(qs);
  }, []);

  const handleStart = (duration: number, selectedSources: string[], questionCount: number) => {
    let filtered = allQuestions.filter(q => selectedSources.includes(q.sourceFile));
    filtered = filtered.sort(() => Math.random() - 0.5);
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
      const timeSpent = response?.timeSpent || 0; // <--- Capture time spent
      
      let isCorrect = false;

      if (userAnswer) {
        attempted++;
        totalAttemptedMarks += q.marks;
        
        isCorrect = isAnswerCorrect(userAnswer, q.correctAnswer as string, q.type);

        if (isCorrect) {
          correct++;
          score += q.marks;
        } else {
          incorrect++;
          if (q.type === QuestionType.MCQ) {
              score -= q.marks / 3;
          }
        }
      }

      return { question: q, userAnswer, isCorrect, timeSpent }; // <--- Pass it here
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
        <Analytics /> 
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