export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  description: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Token Rookie', minXp: 0, maxXp: 250, description: 'Started the journey into lexical scanning and tokens.' },
  { level: 2, title: 'Syntax Explorer', minXp: 250, maxXp: 600, description: 'Mastered grammars and recursive descent parsing.' },
  { level: 3, title: 'Parse Knight', minXp: 600, maxXp: 1100, description: 'Generates flawless Abstract Syntax Trees.' },
  { level: 4, title: 'Semantic Detective', minXp: 1100, maxXp: 1750, description: 'Enforces strict type safety and scoped symbol tables.' },
  { level: 5, title: 'IR Engineer', minXp: 1750, maxXp: 2500, description: 'Constructs efficient Three Address Code representations.' },
  { level: 6, title: 'Optimization Master', minXp: 2500, maxXp: 3400, description: 'Applies constant folding, algebraic simplification & DCE.' },
  { level: 7, title: 'Code Generator', minXp: 3400, maxXp: 4500, description: 'Emits target machine code and manages register allocation.' },
  { level: 8, title: 'Compiler Architect', minXp: 4500, maxXp: 6000, description: 'Grandmaster of the complete end-to-end compiler pipeline.' },
];

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'compiler' | 'challenge' | 'mastery';
  unlockedAt?: string;
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'token_hunter',
    name: 'Token Hunter',
    description: 'Successfully tokenize source code without lexical errors.',
    icon: 'Search',
    category: 'compiler',
  },
  {
    id: 'syntax_solver',
    name: 'Syntax Solver',
    description: 'Construct a complete recursive-descent AST tree.',
    icon: 'Network',
    category: 'compiler',
  },
  {
    id: 'ast_explorer',
    name: 'AST Explorer',
    description: 'Inspect detailed node properties in the visual syntax tree.',
    icon: 'FolderTree',
    category: 'compiler',
  },
  {
    id: 'semantic_detective',
    name: 'Semantic Detective',
    description: 'Verify variable declarations, types, and scope resolution.',
    icon: 'ShieldCheck',
    category: 'compiler',
  },
  {
    id: 'ir_builder',
    name: 'IR Builder',
    description: 'Generate intermediate Three Address Code (TAC).',
    icon: 'Terminal',
    category: 'compiler',
  },
  {
    id: 'optimization_expert',
    name: 'Optimization Expert',
    description: 'Optimize instructions using constant folding & dead code elimination.',
    icon: 'Zap',
    category: 'compiler',
  },
  {
    id: 'code_generator',
    name: 'Code Generator',
    description: 'Produce educational pseudo-assembly instructions.',
    icon: 'Cpu',
    category: 'compiler',
  },
  {
    id: 'compiler_architect',
    name: 'Compiler Architect',
    description: 'Successfully execute all 6 phases of the compiler pipeline.',
    icon: 'Crown',
    category: 'mastery',
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat The Compiler Boss by fixing multi-stage compiler errors.',
    icon: 'Flame',
    category: 'mastery',
  },
  {
    id: 'scholar',
    name: 'Compiler Scholar',
    description: 'Study concepts across all chapters in the Learning Mode.',
    icon: 'BookOpen',
    category: 'challenge',
  },
];

export type ChallengeCategory =
  | 'LEXICAL'
  | 'SYNTAX'
  | 'SEMANTIC'
  | 'INTERMEDIATE CODE'
  | 'OPTIMIZATION'
  | 'COMPILER PIPELINE';

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  hint: string;
  explanation: string;
  badgeUnlockId?: string;
}

export interface BossStage {
  stageNumber: number;
  title: string;
  phase: string;
  bossDialogue: string;
  buggyCode: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  fixedCodeSnippet: string;
  damageToBoss: number;
  explanation: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  level: number;
  xp: number;
  challengesCompleted: number;
  badgesCount: number;
  avatar: string;
}
