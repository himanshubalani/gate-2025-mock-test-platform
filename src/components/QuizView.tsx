import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserResponse, QuestionStatus, QuestionType } from '../types';
import { Timer, ChevronLeft, ChevronRight, Bookmark, CheckCircle, Grid, Menu, Infinity } from 'lucide-react';

interface QuizViewProps {
  questions: Question[];
  durationSeconds: number; // -1 indicates untimed
  onSubmit: (responses: UserResponse[], timeTaken: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, durationSeconds, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // Counts UP
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize
  useEffect(() => {
    setResponses(questions.map(q => ({
      questionId: q.id,
      answer: null,
      timeSpent: 0,
      status: QuestionStatus.NOT_VISITED
    })));
  }, [questions]);

  // Mark visited
  useEffect(() => {
    setResponses(prev => {
      const newResponses = [...prev];
      if (newResponses[currentQuestionIndex] && newResponses[currentQuestionIndex].status === QuestionStatus.NOT_VISITED) {
        newResponses[currentQuestionIndex].status = QuestionStatus.VISITED;
      }
      return newResponses;
    });
  }, [currentQuestionIndex]);

  // Timer Logic (Handles both Timed and Untimed)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      
      // Auto-submit only for timed tests
      if (durationSeconds !== -1 && elapsedSeconds >= durationSeconds) {
        clearInterval(timer);
        handleSubmit();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [elapsedSeconds, durationSeconds]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setResponses(prev => {
      const newResponses = [...prev];
      newResponses[currentQuestionIndex].answer = value;
      const currentStatus = newResponses[currentQuestionIndex].status;
      
      if (currentStatus === QuestionStatus.MARKED_FOR_REVIEW || currentStatus === QuestionStatus.ANSWERED_AND_MARKED) {
        newResponses[currentQuestionIndex].status = value ? QuestionStatus.ANSWERED_AND_MARKED : QuestionStatus.MARKED_FOR_REVIEW;
      } else {
        newResponses[currentQuestionIndex].status = value ? QuestionStatus.ANSWERED : QuestionStatus.VISITED;
      }
      return newResponses;
    });
  };

  const toggleMarkForReview = () => {
    setResponses(prev => {
      const newResponses = [...prev];
      const current = newResponses[currentQuestionIndex];
      const hasAnswer = !!current.answer;
      
      if (current.status === QuestionStatus.MARKED_FOR_REVIEW || current.status === QuestionStatus.ANSWERED_AND_MARKED) {
        current.status = hasAnswer ? QuestionStatus.ANSWERED : QuestionStatus.VISITED;
      } else {
        current.status = hasAnswer ? QuestionStatus.ANSWERED_AND_MARKED : QuestionStatus.MARKED_FOR_REVIEW;
      }
      return newResponses;
    });
  };

  const handleClearResponse = () => {
    setResponses(prev => {
        const newResponses = [...prev];
        newResponses[currentQuestionIndex].answer = null;
        newResponses[currentQuestionIndex].status = QuestionStatus.VISITED;
        return newResponses;
    });
  }

  const handleSubmit = useCallback(() => {
    onSubmit(responses, elapsedSeconds);
  }, [responses, elapsedSeconds, onSubmit]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses[currentQuestionIndex];

  if (!currentQuestion || !currentResponse) return <div className="p-10 text-center">Loading Questions...</div>;

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case QuestionStatus.ANSWERED: return 'bg-green-500 text-white border-green-600';
      case QuestionStatus.ANSWERED_AND_MARKED: return 'bg-purple-500 text-white border-purple-600';
      case QuestionStatus.MARKED_FOR_REVIEW: return 'bg-purple-200 text-purple-800 border-purple-300';
      case QuestionStatus.VISITED: return 'bg-red-500 text-white border-red-600';
      default: return 'bg-gray-200 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center z-20">
         <span className="font-bold text-gray-700">GATE Mock</span>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
             <Menu className="w-6 h-6 text-gray-600"/>
         </button>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 border-b">
            <h2 className="font-semibold text-sm md:text-lg text-gray-800 truncate max-w-[200px]">
              {currentQuestion.sourceFile.replace('.html','')}
            </h2>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${durationSeconds === -1 ? 'bg-indigo-50 border-indigo-100' : 'bg-blue-50 border-blue-100'}`}>
                {durationSeconds === -1 ? <Infinity className="w-5 h-5 text-indigo-600" /> : <Timer className="w-5 h-5 text-blue-600" />}
                <span className={`font-mono text-xl font-bold ${durationSeconds === -1 ? 'text-indigo-700' : 'text-blue-700'}`}>
                    {durationSeconds === -1 ? formatTime(elapsedSeconds) : formatTime(durationSeconds - elapsedSeconds)}
                </span>
            </div>
            <div className="text-sm font-medium text-gray-500 hidden sm:block">
               Mark: <span className="text-black font-bold">+{currentQuestion.marks}</span> / <span className="text-red-500 font-bold">{currentQuestion.type === QuestionType.MCQ ? `-${(currentQuestion.marks/3).toFixed(2)}` : '0'}</span>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 min-h-[400px]">
                <div className="mb-6 border-b pb-4 flex justify-between">
                    <span className="text-gray-500 font-medium">Question {currentQuestionIndex + 1}</span>
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase">{currentQuestion.type}</span>
                </div>
                
                <div 
                  className="prose max-w-none mb-8 text-lg text-gray-800 leading-relaxed question-content"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.html }}
                />

                <div className="space-y-4">
                    {currentQuestion.type === QuestionType.MCQ ? (
                        currentQuestion.options?.map((opt) => (
                            <label 
                                key={opt.index} 
                                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                                    currentResponse.answer === opt.label 
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                    : 'border-gray-200'
                                }`}
                            >
                                <input 
                                    type="radio" 
                                    name={`q-${currentQuestion.id}`} 
                                    value={opt.label}
                                    checked={currentResponse.answer === opt.label}
                                    onChange={() => handleAnswerChange(opt.label)}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 font-bold text-gray-700 min-w-[20px]">{opt.label}.</span>
                                <div 
                                  className="ml-2 text-gray-800 option-content"
                                  dangerouslySetInnerHTML={{ __html: opt.html }}
                                />
                            </label>
                        ))
                    ) : (
                        <div className="max-w-xs">
                             <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer:</label>
                             <input 
                                type="text" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter value"
                                value={currentResponse.answer as string || ''}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                             />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t p-4 flex flex-wrap gap-4 justify-between items-center z-10">
            <div className="flex gap-2">
                 <button onClick={toggleMarkForReview} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 font-medium">
                     <Bookmark className="w-4 h-4" /> {currentResponse.status.includes('MARKED') ? 'Unmark' : 'Mark for Review'}
                 </button>
                 <button onClick={handleClearResponse} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">
                     Clear
                 </button>
            </div>
            
            <div className="flex gap-3">
                 <button 
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(curr => curr - 1)}
                    className="flex items-center gap-1 px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                 >
                     <ChevronLeft className="w-5 h-5" /> Prev
                 </button>
                 {currentQuestionIndex === questions.length - 1 ? (
                     <button onClick={handleSubmit} className="flex items-center gap-1 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold">
                         <CheckCircle className="w-5 h-5" /> Submit
                     </button>
                 ) : (
                    <button onClick={() => setCurrentQuestionIndex(curr => curr + 1)} className="flex items-center gap-1 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold">
                        Next <ChevronRight className="w-5 h-5" />
                    </button>
                 )}
            </div>
        </div>
      </div>

      {/* Palette Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white border-l shadow-xl transform transition-transform duration-300 z-30 md:relative md:translate-x-0 md:w-72 md:shadow-none md:flex md:flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-4 border-b flex justify-between items-center bg-gray-50">
             <h3 className="font-bold text-gray-800 flex items-center gap-2"><Grid className="w-5 h-5" /> Question Palette</h3>
             <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">Close</button>
         </div>
         
         {/* Question Grid */}
         <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-3 content-start">
             {questions.map((q, idx) => (
                 <button
                    key={q.id}
                    onClick={() => { setCurrentQuestionIndex(idx); setIsSidebarOpen(false); }}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm border-2 ${idx === currentQuestionIndex ? 'ring-2 ring-blue-400' : ''} ${getStatusColor(responses[idx]?.status)}`}
                 >
                     {idx + 1}
                 </button>
             ))}
         </div>

         {/* Submit Button & Footer */}
         <div className="p-4 border-t bg-gray-50 space-y-4">
             <button 
                onClick={handleSubmit} 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold shadow-sm transition-colors"
             >
                 <CheckCircle className="w-5 h-5" /> Submit Test
             </button>
             <div className="text-xs text-center text-gray-400 font-medium">GATE 2025 Standard</div>
         </div>
      </div>
    </div>
  );
};

export default QuizView;