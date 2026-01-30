import React, { useState, useMemo } from 'react';
import { Play, Clock, BookOpen, AlertCircle, FileText, CheckSquare, Square, Infinity } from 'lucide-react';
import { Question } from '../types';

interface StartScreenProps {
  onStart: (duration: number, selectedSources: string[], questionCount: number) => void;
  allQuestions: Question[];
}

const DURATIONS = [
  { label: '30 Mins', value: 30 * 60, count: 20 },
  { label: '60 Mins', value: 60 * 60, count: 30 },
  { label: '90 Mins', value: 90 * 60, count: 40 },
  { label: '180 Mins', value: 180 * 60, count: 65 },
  { label: 'Practice', value: -1, count: 50 }, // Untimed Option
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart, allQuestions }) => {
  const [selectedDurationObj, setSelectedDurationObj] = useState(DURATIONS[3]); // Default 180m
  
  const availableSources = useMemo(() => {
    const sources = new Set(allQuestions.map(q => q.sourceFile));
    return Array.from(sources).sort();
  }, [allQuestions]);

  const [selectedSources, setSelectedSources] = useState<string[]>(availableSources);

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source) 
        : [...prev, source]
    );
  };

  const handleSelectAll = () => {
    if (selectedSources.length === availableSources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(availableSources);
    }
  };

  const handleStartClick = () => {
    if (selectedSources.length === 0) {
      alert("Please select at least one Mock Test source.");
      return;
    }
    onStart(selectedDurationObj.value, selectedSources, selectedDurationObj.count);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel */}
        <div className="bg-slate-800 p-8 text-white md:w-1/3 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">GATE 2026</h1>
            <p className="text-slate-300 mb-6">Computer Science Mock Platform</p>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-slate-200">
                  <Clock className="w-5 h-5" /> <span>Real-time Timer</span>
               </div>
               <div className="flex items-center gap-3 text-slate-200">
                  <BookOpen className="w-5 h-5" /> <span>Standard Scoring</span>
               </div>
               <div className="flex items-center gap-3 text-slate-200">
                  <Infinity className="w-5 h-5" /> <span>Untimed Practice</span>
               </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-8"> Deploy Instance • v1.1</div>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:w-2/3 bg-gray-50 overflow-y-auto">
          
          {/* Duration Selection */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Select Duration
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.label}
                  onClick={() => setSelectedDurationObj(d)}
                  className={`py-2 px-1 rounded-lg text-sm font-semibold transition-all border flex flex-col items-center justify-center ${
                    selectedDurationObj.value === d.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span>{d.label}</span>
                  <span className={`text-[10px] font-normal ${selectedDurationObj.value === d.value ? 'text-blue-100' : 'text-gray-400'}`}>
                    {d.value === -1 ? 'Untimed' : `${d.count} Qs`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Source Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Select Mock Tests
                </h3>
                <button 
                    onClick={handleSelectAll}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                >
                    {selectedSources.length === availableSources.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {availableSources.length === 0 ? (
                  <p className="text-sm text-gray-400 italic p-2">No mock tests found in JSON data.</p>
              ) : (
                  availableSources.map((source) => {
                    const isSelected = selectedSources.includes(source);
                    return (
                        <label 
                            key={source} 
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                        >
                        <div className={`w-5 h-5 flex items-center justify-center rounded border ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {isSelected && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input 
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() => toggleSource(source)}
                        />
                        <span className={`ml-3 text-sm truncate ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                            {source.replace('.html', '')}
                        </span>
                        </label>
                    );
                  })
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-8 text-sm text-yellow-800 flex items-start gap-3">
             <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
             <div>
                <p className="font-bold">Session Details:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                   <li>Mode: {selectedDurationObj.value === -1 ? 'Untimed Practice' : 'Timed Exam'}</li>
                   <li>Questions: {selectedDurationObj.count} (Randomized from selection)</li>
                   <li>Marking: -1/3 (1 Mark), -2/3 (2 Marks)</li>
                </ul>
             </div>
          </div>

          <button
            onClick={handleStartClick}
            disabled={selectedSources.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" /> Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;