import { BossStage } from '../types/game';

export interface BossInfo {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  totalRewardXp: number;
  badgeId: string;
  stages: BossStage[];
}

export const COMPILER_BOSS: BossInfo = {
  id: 'compiler_lord_malware',
  name: 'Malwareus the Broken AST',
  title: 'The Compiler Boss',
  maxHp: 500,
  totalRewardXp: 500,
  badgeId: 'boss_slayer',
  stages: [
    {
      stageNumber: 1,
      title: 'Phase 1: Lexical Glitch',
      phase: 'Lexical Analysis',
      bossDialogue: 'Mwahaha! My alien symbols corrupt your scanner! Can you even tokenize this source?',
      buggyCode: `int a = 10;
int b = 20;
int c = a @ b;
print(c);`,
      prompt: 'Identify the lexical flaw causing the scanner to halt.',
      options: [
        "Variable 'c' needs to be declared as float",
        "The '@' character is an illegal token in the language alphabet",
        "The print statement is missing arguments",
        "Semicolon is missing after '20'"
      ],
      correctOptionIndex: 1,
      fixedCodeSnippet: `int a = 10;
int b = 20;
int c = a + b;
print(c);`,
      damageToBoss: 100,
      explanation: "Replacing '@' with a valid binary operator like '+' restores valid tokenization for all characters.",
    },
    {
      stageNumber: 2,
      title: 'Phase 2: The Missing Delimiter',
      phase: 'Syntax Analysis',
      bossDialogue: 'Your parser will choke on this grammar violation! Statements cannot stand without law!',
      buggyCode: `int a = 10
int b = 20;
int c = a + b;
print(c);`,
      prompt: 'What must be fixed to allow the recursive-descent parser to build a valid AST?',
      options: [
        "Change 'int' to 'var'",
        "Add a semicolon ';' to the end of line 1 (after 10)",
        "Wrap the entire program in a class definition",
        "Remove the parentheses in print(c)"
      ],
      correctOptionIndex: 1,
      fixedCodeSnippet: `int a = 10;
int b = 20;
int c = a + b;
print(c);`,
      damageToBoss: 100,
      explanation: "Variable declarations must terminate with a ';' delimiter. Adding it satisfies the grammar rule `VarDecl -> Type ID ('=' Expr)? ';'`.",
    },
    {
      stageNumber: 3,
      title: 'Phase 3: The Undeclared Phantom',
      phase: 'Semantic Analysis',
      bossDialogue: 'Look into your symbol table! Where is this phantom variable declared? You have no entry for it!',
      buggyCode: `int a = 10;
int b = 20;
c = a + b;
print(c);`,
      prompt: 'The semantic analyzer raises an undeclared variable error for `c`. How do we resolve it?',
      options: [
        "Delete 'c' and replace it with zero",
        "Declare `int c = 0;` or `int c = a + b;` before assigning or using it",
        "Make 'a' and 'b' string types",
        "Invert the addition to subtraction"
      ],
      correctOptionIndex: 1,
      fixedCodeSnippet: `int a = 10;
int b = 20;
int c = a + b;
print(c);`,
      damageToBoss: 100,
      explanation: "In statically typed languages, variables must exist in the symbol table before assignment or reference. Adding `int c = ...` records 'c' in the global scope.",
    },
    {
      stageNumber: 4,
      title: 'Phase 4: Intermediate Code Generation',
      phase: 'Intermediate Code',
      bossDialogue: 'Three Address Code is too rigid for you! What temporary instruction does my expression demand?',
      buggyCode: `int x = a * b + 5;`,
      prompt: 'Which Three Address Code sequence properly respects precedence during IR generation?',
      options: [
        "t1 = b + 5\nt2 = a * t1\nx = t2",
        "t1 = a * b\nt2 = t1 + 5\nx = t2",
        "x = a * b + 5 (single instruction)",
        "t1 = 5\nx = t1"
      ],
      correctOptionIndex: 1,
      fixedCodeSnippet: `t1 = a * b
t2 = t1 + 5
x = t2`,
      damageToBoss: 100,
      explanation: "Multiplication evaluates first into `t1 = a * b`, followed by addition `t2 = t1 + 5`, then assigned to `x`.",
    },
    {
      stageNumber: 5,
      title: 'Phase 5: The Final Optimization',
      phase: 'Code Optimization',
      bossDialogue: 'NOOO! My instructions are bloated with redundant dead weight! Purge them if you dare!',
      buggyCode: `int x = 20 * 2;
int y = x + 0;
int dead = 999;
print(y);`,
      prompt: 'Apply Constant Folding, Algebraic Simplification, and Dead Code Elimination to reduce this code.',
      options: [
        "Keep all lines unchanged for debugging",
        "Fold 20 * 2 to 40, simplify x + 0 to x (which is 40), and remove unreferenced 'dead'",
        "Double all constants",
        "Convert everything to float"
      ],
      correctOptionIndex: 1,
      fixedCodeSnippet: `int x = 40;
int y = 40;
print(y);`,
      damageToBoss: 100,
      explanation: "The optimizer calculates constants at compile time, propagates 40 to y, and strips away unused instructions, defeating the boss!",
    },
  ],
};
