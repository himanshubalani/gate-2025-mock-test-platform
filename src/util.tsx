import { Question, QuestionType } from './types';
import rawQuestions from './data/all_mock_questions.json';

// Helper to clean path from "./Folder..." to "/Folder..." for public directory access
const cleanImgPath = (html: string) => {
  return html.replace(/src="\.\//g, 'src="/');
};

export const loadQuestions = (): Question[] => {
  return rawQuestions.map((q: any) => {
    // Determine Question Type
    const qType = q.type === 'MCQ' ? QuestionType.MCQ : QuestionType.SA;

    // Process Options (Assign A, B, C, D)
    let processedOptions = [];
    let derivedCorrectAnswer = q.answer; // Default for SA/NAT

    if (qType === QuestionType.MCQ) {
      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
      
      processedOptions = q.options.map((opt: any, idx: number) => ({
        index: opt.index,
        label: labels[idx] || '?',
        html: cleanImgPath(opt.html)
      }));

      // Find which option matches the answer text to set the correct Label (A/B/C/D)
      // We perform a loose match because HTML formatting might differ slightly
      const correctOpt = processedOptions.find((opt: any) => 
        opt.html.trim() === q.answer.trim() || 
        q.answer.includes(opt.html.trim()) // Fallback loose match
      );

      if (correctOpt) {
        derivedCorrectAnswer = correctOpt.label;
      } else {
        // Fallback: Sometimes answer in JSON might already be "A" or "Option A" depending on extraction
        // For now, if we can't match text, we keep the raw string, 
        // but typically extraction scripts should handle this.
        // Assuming the Python script from previous step extracted raw HTML of the correct label.
      }
    }

    // Assign Marks randomly (1 or 2) since JSON doesn't have it, 
    // or parse it if your extraction script gets it. 
    // Simulating GATE distribution (~60% 1 mark, 40% 2 mark)
    const marks = Math.random() > 0.4 ? 1 : 2;

    return {
      id: q.id,
      type: qType,
      html: cleanImgPath(q.question_html),
      options: processedOptions,
      correctAnswer: derivedCorrectAnswer,
      marks: marks,
      sourceFile: q.source_file || "Unknown Source",
      imagePaths: q.question_images?.map((path: string) => path.replace(/^\.\//, '/'))
    };
  });
};