import { Question, QuestionType } from './src/types';

export const TEST_DURATION_SECONDS = 3 * 60 * 60; // Default 3 Hours
export const PDF_URL = "https://gate.iitk.ac.in/GATE2025/cs_sample_paper.pdf"; // Placeholder or actual link if known

// Data extracted specifically from the provided OCR text
export const MOCK_QUESTIONS: Question[] = [
  // --- General Aptitude (GA) ---
  {
    id: 1,
    section: "General Aptitude",
    type: QuestionType.MCQ,
    text: "Despite his initial hesitation, Rehman's _________ to contribute to the success of the project never wavered.\nSelect the most appropriate option to complete the above sentence.",
    marks: 1,
    correctAnswer: "C",
    options: [
      { id: "opt1", label: "A", text: "ambivalence" },
      { id: "opt2", label: "B", text: "satisfaction" },
      { id: "opt3", label: "C", text: "resolve" },
      { id: "opt4", label: "D", text: "revolve" }
    ]
  },
  {
    id: 2,
    section: "General Aptitude",
    type: QuestionType.MCQ,
    text: "Bird : Nest :: Bee : _______\nSelect the correct option to complete the analogy.",
    marks: 1,
    correctAnswer: "C",
    options: [
      { id: "opt1", label: "A", text: "Kennel" },
      { id: "opt2", label: "B", text: "Hammock" },
      { id: "opt3", label: "C", text: "Hive" },
      { id: "opt4", label: "D", text: "Lair" }
    ]
  },
  {
    id: 3,
    section: "General Aptitude",
    type: QuestionType.MCQ,
    text: "Ravi had ______ younger brother who taught at ______ university. He was widely regarded as ______ honorable man.\nSelect the option with the correct sequence of articles to fill in the blanks.",
    marks: 1,
    correctAnswer: "A",
    options: [
      { id: "opt1", label: "A", text: "a; a; an" },
      { id: "opt2", label: "B", text: "the; an; a" },
      { id: "opt3", label: "C", text: "a; an; a" },
      { id: "opt4", label: "D", text: "an; an; a" }
    ]
  },
  {
    id: 4,
    section: "General Aptitude",
    type: QuestionType.MCQ,
    text: "The CEO's decision to downsize the workforce was considered myopic because it sacrificed long-term stability to accommodate short-term gains.\nSelect the most appropriate option that can replace the word \"myopic\" without changing the meaning of the sentence.",
    marks: 1,
    correctAnswer: "B",
    options: [
      { id: "opt1", label: "A", text: "visionary" },
      { id: "opt2", label: "B", text: "shortsighted" },
      { id: "opt3", label: "C", text: "progressive" },
      { id: "opt4", label: "D", text: "innovative" }
    ]
  },
  {
    id: 5,
    section: "General Aptitude",
    type: QuestionType.MCQ,
    text: "If IMAGE and FIELD are coded as FHBNJ and EMFJG respectively then, which one among the given options is the most appropriate code for BEACH?",
    marks: 2,
    correctAnswer: "B",
    options: [
      { id: "opt1", label: "A", text: "CEADP" },
      { id: "opt2", label: "B", text: "IDBFC" },
      { id: "opt3", label: "C", text: "JGIBC" },
      { id: "opt4", label: "D", text: "IBCEC" }
    ]
  },
  {
    id: 6,
    section: "General Aptitude",
    type: QuestionType.MCQ,
    text: "Based only on the conversation below, identify the logically correct inference:\n\"Even if I had known that you were in the hospital, I would not have gone there to see you\", Ramya told Josephine.",
    marks: 2,
    correctAnswer: "B",
    options: [
      { id: "opt1", label: "A", text: "Ramya knew that Josephine was in the hospital." },
      { id: "opt2", label: "B", text: "Ramya did not know that Josephine was in the hospital." },
      { id: "opt3", label: "C", text: "Ramya and Josephine were once close friends; but now, they are not." },
      { id: "opt4", label: "D", text: "Josephine was in the hospital due to an injury to her leg." }
    ]
  },
   // --- Computer Science (Core) ---
  {
    id: 7,
    section: "Computer Science",
    type: QuestionType.MCQ,
    text: "Consider the following C program:\n\nvoid stringcopy(char *s, char *t) {\n  while(*t)\n    *s++ = *t++;\n}\n\nint main(){\n  char a[30] = \"@#Hello World!\";\n  stringcopy(a, a + 2);\n  printf(\"%s\\n\", a);\n  return 0;\n}\n\nWhich ONE of the following will be the output of the program?",
    marks: 2,
    correctAnswer: "B", // Based on standard C behavior for overlapping memory in manual copy loops
    options: [
      { id: "opt1", label: "A", text: "@#Hello World!" },
      { id: "opt2", label: "B", text: "Hello World!" },
      { id: "opt3", label: "C", text: "ello World!" },
      { id: "opt4", label: "D", text: "Hello World!d!" }
    ]
  },
  {
    id: 8,
    section: "Computer Science",
    type: QuestionType.MCQ,
    text: "Consider an unordered list of N distinct integers. What is the minimum number of element comparisons required to find an integer in the list that is NOT the largest in the list?",
    marks: 1,
    correctAnswer: "A",
    options: [
      { id: "opt1", label: "A", text: "1" },
      { id: "opt2", label: "B", text: "N - 1" },
      { id: "opt3", label: "C", text: "N" },
      { id: "opt4", label: "D", text: "2N - 1" }
    ]
  },
  {
    id: 9,
    section: "Computer Science",
    type: QuestionType.MCQ,
    text: "The average marks obtained by a class in an examination were calculated as 30.8. However, while checking the marks entered, the teacher found that the marks of one student were entered incorrectly as 24 instead of 42. After correcting the marks, the average becomes 31.4. How many students does the class have?",
    marks: 2,
    correctAnswer: "C", // (Sum + 18)/N = 31.4, Sum/N = 30.8. 0.6N = 18 => N = 30.
    options: [
      { id: "opt1", label: "A", text: "25" },
      { id: "opt2", label: "B", text: "28" },
      { id: "opt3", label: "C", text: "30" },
      { id: "opt4", label: "D", text: "32" }
    ]
  },
  {
    id: 10,
    section: "Computer Science",
    type: QuestionType.MCQ,
    text: "A machine receives an IPv4 datagram. The protocol field of the IPv4 header has the protocol number of a protocol X. Which ONE of the following is NOT a possible candidate for X?",
    marks: 1,
    correctAnswer: "D", // RIP uses UDP
    options: [
      { id: "opt1", label: "A", text: "Internet Control Message Protocol (ICMP)" },
      { id: "opt2", label: "B", text: "Internet Group Management Protocol (IGMP)" },
      { id: "opt3", label: "C", text: "Open Shortest Path First (OSPF)" },
      { id: "opt4", label: "D", text: "Routing Information Protocol (RIP)" }
    ]
  },
  {
    id: 11,
    section: "Computer Science",
    type: QuestionType.NAT,
    text: "Consider a stack data structure into which we can PUSH and POP records. We wish to augment the stack with an O(1) time MIN operation.\n\nType the answer below (for simulation, assume key '23' is correct):",
    marks: 2,
    correctAnswer: "23", // Placeholder NAT logic
  },
  {
    id: 12,
    section: "Computer Science",
    type: QuestionType.MCQ,
    text: "Which of the following properties is/are certain to have been violated by the banking system described in Q.27 (Simultaneous transfers)?",
    marks: 2,
    correctAnswer: "C", // Isolation
    options: [
        { id: "opt1", label: "A", text: "Atomicity" },
        { id: "opt2", label: "B", text: "Consistency" },
        { id: "opt3", label: "C", text: "Isolation" },
        { id: "opt4", label: "D", text: "Durability" }
    ]
  }
];