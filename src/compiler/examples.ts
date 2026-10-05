export interface ExampleProgram {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'control' | 'errors' | 'optimization';
  code: string;
  expectedOutcome: string;
}

export const EXAMPLE_PROGRAMS: ExampleProgram[] = [
  {
    id: 'addition',
    title: 'Addition & Output',
    description: 'Declares two integers, calculates their sum, and prints the result.',
    category: 'basics',
    code: `int a = 10;
int b = 20;
int c = a + b;
print(c);`,
    expectedOutcome: 'Generates clean tokens, AST, symbol table, TAC, and target assembly for c = 30.',
  },
  {
    id: 'hello_world',
    title: 'Hello World',
    description: 'A fundamental program printing a greeting string message.',
    category: 'basics',
    code: `string message = "Hello, Compiler Quest!";
print(message);`,
    expectedOutcome: 'Demonstrates string literal handling in lexer, parser, and code generation.',
  },
  {
    id: 'variables',
    title: 'Variable Types & Scopes',
    description: 'Explores multiple supported primitive types: int, float, string, boolean.',
    category: 'basics',
    code: `int score = 100;
float pi = 3.14159;
string player = "Hero";
boolean active = true;

score = score + 50;
print(player);
print(score);`,
    expectedOutcome: 'Populates symbol table with multiple types and verifies type safety.',
  },
  {
    id: 'arithmetic',
    title: 'Complex Arithmetic Expression',
    description: 'Multi-operator arithmetic demonstrating operator precedence (* and / over + and -).',
    category: 'basics',
    code: `int x = 5;
int y = 10;
int z = 2;
int result = x + y * z - 4 / 2;
print(result);`,
    expectedOutcome: 'AST clearly shows precedence tree with y * z evaluated before addition.',
  },
  {
    id: 'conditional',
    title: 'Conditional Statement',
    description: 'Relational comparison with if-else branching logic and label jumps.',
    category: 'control',
    code: `int health = 85;
int threshold = 50;

if (health > threshold) {
    int bonus = 20;
    print(bonus);
} else {
    int penalty = 10;
    print(penalty);
}`,
    expectedOutcome: 'Produces TAC with IF_FALSE_GOTO and branch labels (L_ELSE, L_ENDIF).',
  },
  {
    id: 'optimization',
    title: 'Aggressive Optimization',
    description: 'Showcases Constant Folding, Constant Propagation, Algebraic Simplification, and Dead Code Elimination.',
    category: 'optimization',
    code: `int a = 10 * 2;
int b = a + 0;
int c = b * 1;
int unused = 999;
int d = c + 5;
print(d);`,
    expectedOutcome: 'Optimizer folds 10*2 -> 20, simplifies +0 and *1, propagates 20, and eliminates unused instructions.',
  },
  {
    id: 'syntax_error',
    title: 'Syntax Error Example',
    description: 'Demonstrates syntax error recovery and diagnostic explainer (missing semicolon).',
    category: 'errors',
    code: `int a = 10
int b = 20;
int c = a + b;
print(c);`,
    expectedOutcome: 'Syntax Analyzer catches missing semicolon at line 1 and provides fix advice.',
  },
  {
    id: 'type_error',
    title: 'Type Mismatch Error',
    description: 'Demonstrates semantic type checking detecting invalid assignment of string to int.',
    category: 'errors',
    code: `int counter = 42;
counter = "incompatible_string";
print(counter);`,
    expectedOutcome: 'Semantic Analyzer flags Type Mismatch: Cannot assign string to variable of type int.',
  },
];
