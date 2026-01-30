import React, { useState } from 'react';
import { TestResult, QuestionType, Question } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Clock, Award, ChevronDown, ChevronUp, Home, RefreshCw } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {result.isPractice ? 'Practice Summary' : 'Test Summary'}
                </h1>
                <p className="text-gray-500">
                    Score: <span className="font-bold text-blue-600">{result.score.toFixed(2)}</span> / 
                    {result.isPractice ? (
                        <span className="text-gray-600" title="Based on attempted questions only">{result.totalAttemptedMarks} (Attempted)</span>
                    ) : (
                        <span>{result.totalMarks}</span>
                    )}
                </p>
            </div>
            <div className="flex gap-3">
                <button onClick={onHome} className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"><Home className="w-4 h-4" /> Home</button>
                <button onClick={onRetake} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"><RefreshCw className="w-4 h-4" /> Retake</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <Award className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-2xl font-bold">{result.score.toFixed(2)}</span>
                <span className="text-xs uppercase text-gray-500">Score</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{Math.round(result.accuracy)}%</span>
                <span className="text-xs uppercase text-gray-500">Accuracy</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <Clock className="w-8 h-8 text-purple-500 mb-2" />
                <span className="text-2xl font-bold">{Math.floor(result.timeTaken/60)}m</span>
                <span className="text-xs uppercase text-gray-500">Time Taken</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <span className="text-2xl font-bold mt-2">{result.attempted}/{result.totalQuestions}</span>
                <span className="text-xs uppercase text-gray-500 mt-2">Attempted</span>
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
                                            <span className="text-gray-500">
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
                                                <div className="flex gap-2 items-start">
                                                    <span className="font-bold text-lg min-w-[1rem]">{item.question.correctAnswer}</span>
                                                    <span className="text-gray-600">-</span>
                                                    <div 
                                                        className="text-gray-800 option-content" 
                                                        dangerouslySetInnerHTML={{ __html: getOptionContent(item.question, item.question.correctAnswer) || '' }} 
                                                    />
                                                </div>
                                            ) : (
                                                <span className="font-mono text-lg">{item.question.correctAnswer}</span>
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