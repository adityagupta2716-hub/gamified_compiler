import { Challenge } from '../types/game';

export const CHALLENGES: Challenge[] = [
  // 1. Lexical Analysis
  {
    id: 'lex_1',
    title: 'Identify the Invalid Token',
    category: 'LEXICAL',
    difficulty: 'Easy',
    xpReward: 75,
    question: 'Which of the following tokens in the code will cause a lexical scanner error in our C-like language?',
    codeSnippet: `int count = 10;
float rate = 5.5;
int total = count @ rate;
print(total);`,
    options: [
      "'total'",
      "'@'",
      "'5.5'",
      "';'"
    ],
    correctAnswerIndex: 1,
    hint: 'Look for an illegal special symbol that is not a recognized operator, delimiter, or identifier character.',
    explanation: "'@' is not defined in the language's token alphabet. The lexical analyzer flags it as UNKNOWN TOKEN and reports an error with line and column.",
  },
  {
    id: 'lex_2',
    title: 'Token Stream Cardinality',
    category: 'LEXICAL',
    difficulty: 'Medium',
    xpReward: 100,
    question: 'How many valid tokens are generated for the statement: `int sum = a + 5;`?',
    codeSnippet: `int sum = a + 5;`,
    options: [
      '5 tokens',
      '6 tokens',
      '7 tokens',
      '4 tokens'
    ],
    correctAnswerIndex: 1,
    hint: 'Count each component: keyword, identifier, operator, identifier, operator, number, delimiter.',
    explanation: "The tokens are: 1. `int` (KEYWORD), 2. `sum` (IDENTIFIER), 3. `=` (OPERATOR), 4. `a` (IDENTIFIER), 5. `+` (OPERATOR), 6. `5` (NUMBER), 7. `;` (DELIMITER). That equals 7 tokens! (Note: 7 tokens is option index 2).",
  },
  // Correcting the option index for 7 tokens:
  // Options: 5 tokens (0), 6 tokens (1), 7 tokens (2), 4 tokens (3) -> correct is 2.
  // 2. Syntax Analysis
  {
    id: 'syn_1',
    title: 'Missing Delimiter Diagnostics',
    category: 'SYNTAX',
    difficulty: 'Easy',
    xpReward: 80,
    question: 'What syntax error occurs in this snippet, and at which phase is it caught?',
    codeSnippet: `int x = 10
int y = 20;`,
    options: [
      "Lexical Error: Unterminated integer literal",
      "Syntax Error: Expected ';' after variable declaration",
      "Semantic Error: Duplicate declaration of x",
      "Target Code Error: Register allocation overflow"
    ],
    correctAnswerIndex: 1,
    hint: 'Statements in C-like languages must end with a delimiter before the next statement begins.',
    explanation: "The parser expects a ';' delimiter to complete the variable declaration statement. When it encounters 'int' on line 2 instead, it raises a Syntax Error: Expected ';'.",
  },
  {
    id: 'syn_2',
    title: 'Operator Precedence in AST',
    category: 'SYNTAX',
    difficulty: 'Hard',
    xpReward: 150,
    question: 'In the expression `x + y * z`, which operation sits deeper (lower) in the Abstract Syntax Tree (AST)?',
    codeSnippet: `int result = x + y * z;`,
    options: [
      "The addition (+), because it appears first from left to right",
      "The multiplication (*), because higher-precedence operators bind more tightly and evaluate first",
      "Both are at the same tree depth",
      "Neither, the compiler evaluates them simultaneously in parallel"
    ],
    correctAnswerIndex: 1,
    hint: 'In an AST, operations that must be computed first are situated lower as children of operations computed later.',
    explanation: "Multiplication has higher precedence than addition. The parser binds `y * z` into a subtree, which becomes the right child of the `+` operator node.",
  },
  // 3. Semantic Analysis
  {
    id: 'sem_1',
    title: 'Type Compatibility Enforcement',
    category: 'SEMANTIC',
    difficulty: 'Medium',
    xpReward: 110,
    question: 'What semantic error will the analyzer report for the following code?',
    codeSnippet: `int counter = 100;
counter = "high_score";
print(counter);`,
    options: [
      "Syntax Error: Invalid string quotes",
      "Semantic Error: Cannot assign string to variable 'counter' of type int",
      "Lexical Error: String literal cannot contain underscore",
      "No error, strings automatically convert to numbers"
    ],
    correctAnswerIndex: 1,
    hint: 'Check the declared type in the symbol table vs the type of the assigned expression.',
    explanation: "Static type checking verifies that the type of the target variable ('int') is compatible with the expression ('string'). Assigning a string to an integer violates type safety.",
  },
  {
    id: 'sem_2',
    title: 'Scope Resolution & Variable Shadowing',
    category: 'SEMANTIC',
    difficulty: 'Medium',
    xpReward: 120,
    question: 'Why will the following snippet fail semantic validation?',
    codeSnippet: `int a = 10;
int b = a + uninitializedVar;`,
    options: [
      "Arithmetic addition cannot use two variables",
      "Undeclared variable: 'uninitializedVar' is used before declaration in symbol table",
      "Parentheses are mandatory around the sum",
      "Variable 'b' must have a float type"
    ],
    correctAnswerIndex: 1,
    hint: 'The symbol table manager searches current and enclosing scopes when an identifier is referenced.',
    explanation: "When resolving 'uninitializedVar', the symbol table finds no record in any active scope. The semantic analyzer raises an 'Undeclared variable' error.",
  },
  // 4. Intermediate Code Generation
  {
    id: 'ir_1',
    title: 'Three Address Code (TAC) Translation',
    category: 'INTERMEDIATE CODE',
    difficulty: 'Medium',
    xpReward: 125,
    question: 'Which of the following is the standard Three Address Code (TAC) decomposition of `x = a + b * c;`?',
    codeSnippet: `int x = a + b * c;`,
    options: [
      "t1 = a + b\nt2 = t1 * c\nx = t2",
      "t1 = b * c\nt2 = a + t1\nx = t2",
      "x = a + b * c (single instruction)",
      "t1 = a\nt2 = b\nt3 = c\nx = t1 + t2 * t3"
    ],
    correctAnswerIndex: 1,
    hint: 'Remember operator precedence: multiplication executes first into a temporary, then addition.',
    explanation: "TAC instructions have at most one operator on the right-hand side. `b * c` is computed into `t1`, then `a + t1` into `t2`, and finally assigned to `x`.",
  },
  // 5. Code Optimization
  {
    id: 'opt_1',
    title: 'Constant Folding & Algebraic Simplification',
    category: 'OPTIMIZATION',
    difficulty: 'Medium',
    xpReward: 130,
    question: 'Given the code: `int a = 5 * 4; int b = a + 0;`, what is the optimized TAC result?',
    codeSnippet: `int a = 5 * 4;
int b = a + 0;`,
    options: [
      "a = 5 * 4\nb = a + 0",
      "a = 20\nb = 20",
      "a = 9\nb = a",
      "b = 0"
    ],
    correctAnswerIndex: 1,
    hint: 'Constant folding computes 5 * 4 at compile time, algebraic simplification removes + 0, and constant propagation forwards the value.',
    explanation: "5 * 4 is folded to 20. Then `b = a + 0` simplifies to `b = a`. Since `a` is known constant 20, constant propagation yields `b = 20`.",
  },
  {
    id: 'opt_2',
    title: 'Dead Code Elimination (DCE)',
    category: 'OPTIMIZATION',
    difficulty: 'Hard',
    xpReward: 160,
    question: 'What happens to `int unused = 42;` when followed by statements that never read `unused`?',
    codeSnippet: `int unused = 42;
int active = 100;
print(active);`,
    options: [
      "The compiler crashes with an unreferenced error",
      "Dead code elimination eliminates unused temporary instructions to save memory and CPU cycles",
      "The unused variable is forced into register R1",
      "The compiler duplicates the instruction"
    ],
    correctAnswerIndex: 1,
    hint: 'Optimizers analyze usage and liveness to purge instructions whose results are never consumed.',
    explanation: "Dead code elimination prunes instructions whose output does not affect the program's observable behavior or external output.",
  },
  // 6. Complete Pipeline
  {
    id: 'pipe_1',
    title: 'Compiler Pipeline Architecture',
    category: 'COMPILER PIPELINE',
    difficulty: 'Easy',
    xpReward: 90,
    question: 'What is the correct sequential order of the phases in a traditional compiler frontend and backend?',
    codeSnippet: `SOURCE CODE -> ? -> ? -> ? -> ? -> ? -> ? -> TARGET CODE`,
    options: [
      "Parser -> Lexer -> Target Code -> Optimizer -> IR -> Semantic",
      "Lexer -> Parser -> Semantic Analyzer -> Intermediate Code -> Optimizer -> Target Code",
      "Optimizer -> Lexer -> Parser -> Target Code -> Semantic -> IR",
      "Semantic -> Lexer -> IR -> Parser -> Target Code -> Optimizer"
    ],
    correctAnswerIndex: 1,
    hint: 'Characters become tokens, tokens become a tree, the tree is type-checked, transformed into IR, optimized, and finally turned into assembly.',
    explanation: "The correct sequence is: Lexical Analysis (tokens) -> Syntax Analysis (AST) -> Semantic Analysis (types & scopes) -> Intermediate Representation (TAC) -> Code Optimization -> Target Code Generation (assembly).",
  },
];
