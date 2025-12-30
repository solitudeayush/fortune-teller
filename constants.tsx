
import { Question } from './types';

export const SYMBOLIC_QUESTIONS: Question[] = [
  // PHASE 1: Cognitive Pattern Discovery (Thinking Style)
  {
    id: 'p1_1',
    phase: 'Cognitive Patterns',
    text: "When facing uncertainty, you rely more on:",
    options: [
      { text: 'Logical step-by-step reasoning', weights: { CSE: 2, IT: 2, CE: 1 } },
      { text: 'Intuitive experience and observation', weights: { ME: 2, ECE: 2, EEE: 1 } }
    ]
  },
  {
    id: 'p1_2',
    phase: 'Cognitive Patterns',
    text: "Do you enjoy optimizing existing systems or executing defined tasks?",
    options: [
      { text: 'Optimizing and refining', weights: { CSE: 2, EEE: 2, IT: 1 } },
      { text: 'Executing and delivering', weights: { ME: 1, CE: 2, ECE: 1 } }
    ]
  },
  {
    id: 'p1_3',
    phase: 'Cognitive Patterns',
    text: "When stuck, do you think better alone or using external tools?",
    options: [
      { text: 'Deep solitary reflection', weights: { CSE: 2, IT: 1, CE: 1 } },
      { text: 'Hands-on tool interaction', weights: { ME: 2, EEE: 1, ECE: 2 } }
    ]
  },
  {
    id: 'p1_4',
    phase: 'Cognitive Patterns',
    text: "Do you prefer detailed blueprints or abstract concepts?",
    options: [
      { text: 'Blueprints and structures', weights: { CE: 3, ME: 2, EEE: 1 } },
      { text: 'Abstract logic and data', weights: { CSE: 3, IT: 2, ECE: 1 } }
    ]
  },
  {
    id: 'p1_5',
    phase: 'Cognitive Patterns',
    text: "Your approach to a new device is:",
    options: [
      { text: 'Reading the documentation first', weights: { CE: 1, EEE: 2, CSE: 1 } },
      { text: 'Diving in and testing features', weights: { ME: 2, ECE: 2, IT: 1 } }
    ]
  },
  {
    id: 'p1_6',
    phase: 'Cognitive Patterns',
    text: "Which sounds more like you?",
    options: [
      { text: 'The Architect (Structure & Plan)', weights: { CE: 2, CSE: 1, EEE: 1 } },
      { text: 'The Explorer (Discovery & Trial)', weights: { ME: 1, ECE: 2, IT: 2 } }
    ]
  },
  // PHASE 2: Learning & Work Preference
  {
    id: 'p2_1',
    phase: 'Learning & Work',
    text: "Which college activity excites you more?",
    options: [
      { text: 'Coding and debugging software', weights: { CSE: 3, IT: 2 } },
      { text: 'Building and testing hardware', weights: { ME: 2, ECE: 2, EEE: 2 } }
    ]
  },
  {
    id: 'p2_2',
    phase: 'Learning & Work',
    text: "You prefer results that are:",
    options: [
      { text: 'Digital, precise, and virtual', weights: { CSE: 2, IT: 2, ECE: 1 } },
      { text: 'Physical, visible, and tangible', weights: { ME: 3, CE: 3, EEE: 1 } }
    ]
  },
  {
    id: 'p2_3',
    phase: 'Learning & Work',
    text: "In a group project, you naturally choose:",
    options: [
      { text: 'Managing the data and logic', weights: { CSE: 2, IT: 2, EEE: 1 } },
      { text: 'Designing the physical prototype', weights: { ME: 2, CE: 1, ECE: 2 } }
    ]
  },
  {
    id: 'p2_4',
    phase: 'Learning & Work',
    text: "When learning something new, you need:",
    options: [
      { text: 'To understand the underlying theory', weights: { CSE: 2, CE: 2, EEE: 2 } },
      { text: 'To see a practical application', weights: { ME: 2, IT: 1, ECE: 2 } }
    ]
  },
  {
    id: 'p2_5',
    phase: 'Learning & Work',
    text: "Your ideal workspace contains:",
    options: [
      { text: 'Multiple screens and high-speed data', weights: { CSE: 2, IT: 2, ECE: 1 } },
      { text: 'Tools, instruments, and physical parts', weights: { ME: 2, CE: 1, EEE: 2 } }
    ]
  },
  // PHASE 3: Engineering Fit Simulation (Scenario-based)
  {
    id: 'p3_1',
    phase: 'Engineering Scenarios',
    text: "Scenario: A project deadline is tomorrow. What do you do first?",
    options: [
      { text: 'Plan the logic and structure', weights: { CSE: 2, IT: 2, CE: 2 } },
      { text: 'Start building immediately', weights: { ME: 2, ECE: 2, EEE: 2 } }
    ]
  },
  {
    id: 'p3_2',
    phase: 'Engineering Scenarios',
    text: "Scenario: Your system fails unexpectedly. You prefer to:",
    options: [
      { text: 'Debug step by step via logs', weights: { CSE: 3, IT: 3, ECE: 1 } },
      { text: 'Replace and rebuild components', weights: { ME: 3, EEE: 2, CE: 1 } }
    ]
  },
  {
    id: 'p3_3',
    phase: 'Engineering Scenarios',
    text: "Scenario: You are designing a bridge sensor network. You focus on:",
    options: [
      { text: 'The material load-bearing capacity', weights: { CE: 3, ME: 1 } },
      { text: 'The data transmission and logic', weights: { ECE: 2, IT: 2, CSE: 1 } }
    ]
  }
];

export const BRANCH_NAMES: Record<string, string> = {
  CSE: 'Computer Science Engineering (CSE)',
  IT: 'Information Technology (IT)',
  ECE: 'Electronics & Comm. Engineering (ECE)',
  ME: 'Mechanical Engineering (ME)',
  CE: 'Civil Engineering (CE)',
  EEE: 'Electrical & Electronics Engineering (EEE)'
};

export const THEMES: Record<string, string> = {
  CSE: 'from-blue-50 to-indigo-100',
  IT: 'from-cyan-50 to-blue-100',
  ECE: 'from-emerald-50 to-teal-100',
  ME: 'from-orange-50 to-amber-100',
  CE: 'from-slate-100 to-gray-300',
  EEE: 'from-purple-50 to-indigo-100',
  default: 'from-slate-50 to-blue-50'
};
