import { Question, QuestionType, Option } from './types';
import rawQuestions from './data/all_mock_questions.json';

// Helper to clean path from "./Folder..." to "/Folder..."
const cleanImgPath = (html: string) => {
  if (!html) return "";
  return html.replace(/src="\.\//g, 'src="/');
};

// Helper to clean Answer strings
const cleanAnswerString = (ans: string) => {
  if (!ans) return "";
  // Remove (Type: Numeric) or (Type: Range) prefix
  return ans.replace(/\(Type:\s*(Numeric|Range)\)\s*/gi, '').trim();
};

export const loadQuestions = (): Question[] => {
  return rawQuestions.map((q: any) => {
    // Determine Question Type
    // The JSON might say "SA" or "NAT", or implied by the answer format
    let qType = q.type === 'MCQ' ? QuestionType.MCQ : QuestionType.NAT;
    
    // NPTEL specific: Sometimes SA questions are labeled differently or contain Range
    if (q.answer && (q.answer.includes('Numeric') || q.answer.includes('Range'))) {
        qType = QuestionType.NAT;
    }

    let processedOptions: Option[] = [];
    let finalCorrectAnswer = cleanAnswerString(q.answer);

    if (qType === QuestionType.MCQ) {
      const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
      
      processedOptions = q.options.map((opt: any, idx: number) => ({
        id: `opt-${idx}`, // Ensure unique ID
        index: opt.index,
        label: labels[idx] || '?',
        html: cleanImgPath(opt.html),
        text: "" // Helper if needed
      }));

      // Try to map the answer text back to a Label (A, B, C, D)
      // Often the JSON answer is the HTML of the correct option
      const correctOpt = processedOptions.find((opt: any) => 
        opt.html.trim() === q.answer.trim() || 
        q.answer.includes(opt.html.trim())
      );

      if (correctOpt) {
        finalCorrectAnswer = correctOpt.label;
      } else {
        // If we can't find a label match, it might be an image answer. 
        // We keep the cleaned HTML as the answer for display purposes, 
        // but for scoring, we might need manual review if logic fails.
        finalCorrectAnswer = cleanImgPath(q.answer);
      }
    }

    // Default marks if missing
    const marks = q.marks ? parseInt(q.marks) : (Math.random() > 0.4 ? 1 : 2);

    return {
      id: q.id,
      text: "", // We use html
      type: qType,
      html: cleanImgPath(q.question_html),
      options: processedOptions,
      correctAnswer: finalCorrectAnswer,
      marks: marks,
      section: "Computer Science", // Default section
      sourceFile: q.source_file || "Unknown Source",
      imagePaths: q.question_images?.map((path: string) => path.replace(/^\.\//, '/'))
    };
  });
};