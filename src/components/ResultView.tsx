import React, { useState } from 'react';
import { TestResult, QuestionType, Question } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Clock, Award, ChevronDown, ChevronUp, Home, RefreshCw, Timer } from 'lucide-react';

interface ResultViewProps {
  result: TestResult;
  onRetake: () => void;
  onHome: () => void;
}

const COLORS = ['#10B981', '#EF4444', '#E5E7EB'];

const ResultView: React.FC<ResultViewProps> = ({ result, onRetake, onHome }) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const pieData = [
    { name: 'Correct', value: result.correct },
    { name: 'Incorrect', value: result.incorrect },
    { name: 'Unattempted', value: result.totalQuestions - result.attempted },
  ];

  const toggleExpand = (id: string) => {
      setExpandedQuestionId(prev => prev === id ? null : id);
  }

  // Helper to get the HTML content of an option based on its Label (A, B, C, D)
  const getOptionContent = (question: Question, answerLabel: string | null) => {
    if (!answerLabel || question.type !== QuestionType.MCQ || !question.options) return null;
    const option = question.options.find(opt => opt.label === answerLabel);
    return option ? option.html : null;
  };

  // Calculate Percentages
  const attemptedPercentage = result.totalAttemptedMarks > 0 
    ? ((result.score / result.totalAttemptedMarks) * 100).toFixed(2) 
    : "0.00";

  const totalPercentage = result.totalMarks > 0 
    ? ((result.score / result.totalMarks) * 100).toFixed(2) 
    : "0.00";

  // Calculate Avg Time per Question (Using specific timeSpent from Attempted questions)
  const attemptedQuestionsList = result.questionAnalysis.filter(q => q.userAnswer !== null);
  const totalTimeSpentOnAttempted = attemptedQuestionsList.reduce((acc, curr) => acc + curr.timeSpent, 0);
  const avgTimePerQuestion = attemptedQuestionsList.length > 0 
    ? Math.round(totalTimeSpentOnAttempted / attemptedQuestionsList.length) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    {result.isPractice ? 'Practice Summary' : 'Test Summary'}
                </h1>
                
                {/* Score Breakdown Bar */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-4 text-sm md:text-base text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">Score:</span>
                    
                    {/* Attempted Stats */}
                    <div className={`flex items-center gap-1.5 ${result.isPractice ? 'px-2 py-1 bg-blue-100 rounded-lg border border-blue-200 text-blue-800' : ''}`} title="Score based on questions you attempted">
                        <span className={`font-mono font-bold text-lg ${result.isPractice ? 'text-blue-700' : 'text-gray-700'}`}>
                            {result.score.toFixed(2)}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="font-medium">{result.totalAttemptedMarks}</span>
                        <span className="text-xs font-medium uppercase tracking-wide opacity-70">(Attempted)</span>
                        <span className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-full ${result.isPractice ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {attemptedPercentage}%
                        </span>
                    </div>

                    <span className="text-gray-300 text-xl font-light hidden sm:inline">|</span>

                    {/* Total Stats */}
                    <div className={`flex items-center gap-1.5 ${!result.isPractice ? 'px-2 py-1 bg-blue-100 rounded-lg border border-blue-200 text-blue-800' : ''}`} title="Score based on total available questions">
                         <span className={`font-mono font-bold text-lg ${!result.isPractice ? 'text-blue-700' : 'text-gray-700'}`}>
                            {result.score.toFixed(2)}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="font-medium">{result.totalMarks}</span>
                        <span className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-full ${!result.isPractice ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {totalPercentage}%
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
                <button onClick={onHome} className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"><Home className="w-4 h-4" /> Home</button>
                <button onClick={onRetake} className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"><RefreshCw className="w-4 h-4" /> Retake</button>
            </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <Award className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-2xl font-bold">{result.score.toFixed(2)}</span>
                <span className="text-xs uppercase text-gray-500 text-center">Score</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{Math.round(result.accuracy)}%</span>
                <span className="text-xs uppercase text-gray-500 text-center">Accuracy</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <Clock className="w-8 h-8 text-purple-500 mb-2" />
                <span className="text-2xl font-bold">{Math.floor(result.timeTaken/60)}m</span>
                <span className="text-xs uppercase text-gray-500 text-center">Total Time</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center mb-2 font-bold text-gray-400 border-2 border-gray-300 rounded-lg">#</div>
                <span className="text-2xl font-bold mt-0">{result.attempted}/{result.totalQuestions}</span>
                <span className="text-xs uppercase text-gray-500 text-center">Attempted</span>
            </div>
            {/* Avg Time Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center col-span-2 md:col-span-1">
                <Timer className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-2xl font-bold">{avgTimePerQuestion}s</span>
                <span className="text-xs uppercase text-gray-500 text-center">Avg Time / Q</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-1 h-80">
                <h3 className="font-bold text-gray-800 mb-4">Performance</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
                <h3 className="font-bold text-gray-800 mb-4">Detailed Analysis</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {result.questionAnalysis.map((item, index) => (
                        <div key={item.question.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpand(item.question.id)}>
                                <div className="flex gap-4 w-full">
                                    <span className="font-mono text-gray-400 font-bold w-8">Q{index + 1}</span>
                                    <div className="flex-1">
                                        <div className="text-gray-800 font-medium line-clamp-1" dangerouslySetInnerHTML={{ __html: item.question.html.substring(0, 100) + "..." }} />
                                        <div className="flex gap-3 mt-2 text-sm">
                                            <span className={`flex items-center gap-1 ${item.isCorrect ? 'text-green-600' : item.userAnswer ? 'text-red-600' : 'text-gray-400'}`}>
                                                {item.isCorrect ? <CheckCircle className="w-4 h-4"/> : item.userAnswer ? <XCircle className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                                                {item.isCorrect ? 'Correct' : item.userAnswer ? 'Incorrect' : 'Unattempted'}
                                            </span>
                                            <span className="text-gray-400 border-l pl-3 flex items-center gap-1">
                                                <Timer className="w-3 h-3" /> {item.timeSpent}s
                                            </span>
                                            <span className="text-gray-500 border-l pl-3">
                                                Marks: {item.isCorrect ? item.question.marks : 0}/{item.question.marks}
                                                {!item.isCorrect && item.userAnswer && item.question.type === QuestionType.MCQ && (
                                                    <span className="text-red-500 ml-1">(-{(item.question.marks / 3).toFixed(2)})</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-gray-400">
                                    {expandedQuestionId === item.question.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                                </button>
                            </div>

                            {expandedQuestionId === item.question.id && (
                                <div className="mt-4 pt-4 border-t space-y-4">
                                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: item.question.html }} />
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        
                                        {/* Your Answer Column */}
                                        <div className="p-3 bg-red-50 text-red-700 rounded border border-red-100 flex flex-col">
                                            <span className="font-bold block text-xs uppercase text-red-400 mb-2">Your Answer</span>
                                            {item.userAnswer ? (
                                                item.question.type === QuestionType.MCQ ? (
                                                    <div className="flex gap-2 items-start">
                                                        <span className="font-bold text-lg min-w-[1rem]">{item.userAnswer}</span>
                                                        <span className="text-gray-600">-</span>
                                                        <div 
                                                            className="text-gray-800 option-content" 
                                                            dangerouslySetInnerHTML={{ __html: getOptionContent(item.question, item.userAnswer) || '' }} 
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="font-mono text-lg">{item.userAnswer}</span>
                                                )
                                            ) : (
                                                <span className="italic text-red-400">Not Answered</span>
                                            )}
                                        </div>

                                        {/* Correct Answer Column */}
                                        <div className="p-3 bg-green-50 text-green-700 rounded border border-green-100 flex flex-col">
                                            <span className="font-bold block text-xs uppercase text-green-400 mb-2">Correct Answer</span>
                                            
                                            {item.question.type === QuestionType.MCQ ? (
                                                ['A','B','C','D'].includes(item.question.correctAnswer as string) ? (
                                                    <div className="flex gap-2 items-start">
                                                        <span className="font-bold text-lg min-w-[1rem]">{item.question.correctAnswer}</span>
                                                        <span className="text-gray-600">-</span>
                                                        <div 
                                                            className="text-gray-800 option-content" 
                                                            dangerouslySetInnerHTML={{ __html: getOptionContent(item.question, item.question.correctAnswer as string) || '' }} 
                                                        />
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="text-gray-800 option-content" 
                                                        dangerouslySetInnerHTML={{ __html: item.question.correctAnswer as string }} 
                                                    />
                                                )
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-lg">
                                                        {(item.question.correctAnswer as string).includes(',') 
                                                            ? `Range: ${item.question.correctAnswer}` 
                                                            : item.question.correctAnswer}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;