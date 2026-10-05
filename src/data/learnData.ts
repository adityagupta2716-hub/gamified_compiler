export interface LearnModule {
  id: string;
  phaseNumber: number;
  title: string;
  tagline: string;
  content: string[];
  keyConcepts: string[];
  diagram: string;
  exampleCode: string;
  vivaQuestions: Array<{ q: string; a: string }>;
}

export const LEARN_MODULES: LearnModule[] = [
  {
    id: 'intro',
    phaseNumber: 0,
    title: 'What is a Compiler?',
    tagline: 'Bridging the chasm between human-readable source code and machine execution.',
    content: [
      'A compiler is a specialized software system that translates computer code written in a high-level language (source language) into another language (target language, usually machine code or assembly) without changing the program semantics.',
      'The compilation pipeline is conventionally bifurcated into two main divisions: the Analysis Phase (Frontend), which understands and verifies the source code, and the Synthesis Phase (Backend), which optimizes and generates efficient target machine instructions.',
      'Modern compilers employ an Intermediate Representation (IR) between frontend and backend. This decouples language parsing from machine architecture, allowing an N-language frontend to pair with an M-architecture backend with N + M components instead of N * M compilers.'
    ],
    keyConcepts: [
      'Frontend (Analysis) vs Backend (Synthesis)',
      'Intermediate Representation (IR)',
      'Static Compilation vs Just-In-Time (JIT)',
      'Error Handling & Diagnostics'
    ],
    diagram: `+-------------+      +----------------+      +---------------+
| Source Code | ---> | Compiler Front | ---> | Intermediate  |
+-------------+      | (Lex/Parse/Sem)|      | Code (TAC)    |
                     +----------------+      +---------------+
                                                     |
                                                     v
+-------------+      +----------------+      +---------------+
| Target Code | <--- | Compiler Back  | <--- | Code          |
| (Assembly)  |      | (Register/Gen) |      | Optimizer     |
+-------------+      +----------------+      +---------------+`,
    exampleCode: `int a = 10;
int b = 20;
int sum = a + b;
print(sum);`,
    vivaQuestions: [
      {
        q: 'What is the primary difference between a compiler and an interpreter?',
        a: 'A compiler translates the entire source program into machine code before execution, resulting in faster runtime performance. An interpreter analyzes and executes the source code line-by-line on the fly.'
      },
      {
        q: 'What are compiler passes?',
        a: 'A pass refers to a complete traversal of the source program or intermediate representation. Single-pass compilers process code in one go, while multi-pass compilers separate phases (like analysis, optimization, code generation) into distinct traversals.'
      }
    ]
  },
  {
    id: 'lexical',
    phaseNumber: 1,
    title: 'Phase 1: Lexical Analysis',
    tagline: 'Converting a raw stream of characters into meaningful syntactic tokens.',
    content: [
      'The Lexical Analyzer (Scanner) reads the source code character by character, strips away comments and unnecessary whitespace, and groups characters into character sequences called lexemes.',
      'For each recognized lexeme, the scanner produces a structured Token `<type, value, line, col>`. Regular expressions define the patterns for tokens, and Deterministic Finite Automata (DFA) power the recognition engine.',
      'When an unknown character (such as `@` or `$`) appears outside a string literal, the lexer identifies it immediately and emits a precise Lexical Error with exact line and column numbers.'
    ],
    keyConcepts: [
      'Tokens, Lexemes, and Patterns',
      'Finite State Automata (NFA to DFA conversion)',
      'Regular Expressions for Token Specification',
      'Handling comments and tracking line/column locations'
    ],
    diagram: `Source: "int x = 42;"
Character Stream: ['i', 'n', 't', ' ', 'x', ' ', '=', ' ', '4', '2', ';']
       |
       v  [Lexical Scanner / DFA]
Tokens:
[KEYWORD: "int"]  --> [IDENTIFIER: "x"] --> [OPERATOR: "="] --> [NUMBER: "42"] --> [DELIMITER: ";"]`,
    exampleCode: `// Lexical scanning test
float radius = 7.5;
float pi = 3.14159;
float area = pi * radius * radius;
print(area);`,
    vivaQuestions: [
      {
        q: 'What is the difference between a token, a lexeme, and a pattern?',
        a: 'A token is an abstract symbol representing a grammatical category (e.g. NUMBER). A lexeme is the concrete string of characters matching that token in the source code (e.g. "42"). A pattern is the regular expression rule specifying what constitutes a token.'
      },
      {
        q: 'Why is lexical analysis separated from syntax analysis?',
        a: 'Separation simplifies design, improves compiler efficiency (specialized buffering techniques can be applied to character scanning), and enhances compiler portability.'
      }
    ]
  },
  {
    id: 'syntax',
    phaseNumber: 2,
    title: 'Phase 2: Syntax Analysis',
    tagline: 'Validating grammar and building the Abstract Syntax Tree (AST).',
    content: [
      'The Syntax Analyzer (Parser) takes the token stream from the lexer and verifies that the structure conforms to the formal Context-Free Grammar (CFG) of the programming language.',
      'Our educational compiler employs a Recursive-Descent Parser with predictive lookahead. Each non-terminal grammar rule is implemented as a dedicated parsing function.',
      'The output of this phase is an Abstract Syntax Tree (AST), which encapsulates the hierarchical nested structure of expressions, control flow, and declarations while discarding syntactic noise like semicolons and parentheses.'
    ],
    keyConcepts: [
      'Context-Free Grammars (CFG) & BNF Notation',
      'Recursive-Descent Parsing',
      'Abstract Syntax Tree (AST) vs Concrete Parse Tree',
      'Operator Precedence and Associativity'
    ],
    diagram: `Grammar Rule: Assignment -> ID '=' Expr ';'
                  Assignment
                 /          \\
            Target: c     BinaryExpr (+)
                          /            \\
                      Left: a        Right: b`,
    exampleCode: `int a = 10;
int b = 20;
int c = a + b * 2;
print(c);`,
    vivaQuestions: [
      {
        q: 'What is the difference between a Parse Tree and an Abstract Syntax Tree (AST)?',
        a: 'A parse tree contains every grammar symbol including punctuation and delimiters (semicolons, parentheses). An AST represents the syntactic structure concisely, retaining only operands and operators necessary for semantic processing and code generation.'
      },
      {
        q: 'What causes ambiguity in a grammar, and how is it resolved?',
        a: 'A grammar is ambiguous if a sentence can produce more than one parse tree. Ambiguity is resolved by establishing explicit operator precedence and associativity rules (e.g., rewriting expression grammars with tiered non-terminals).'
      }
    ]
  },
  {
    id: 'semantic',
    phaseNumber: 3,
    title: 'Phase 3: Semantic Analysis',
    tagline: 'Ensuring meaning, static type safety, and scope integrity.',
    content: [
      'A program may be syntactically valid yet logically invalid (e.g., `int x = "hello";` or referencing an undeclared variable). The Semantic Analyzer validates static semantics.',
      'Central to this phase is the Symbol Table, a hierarchical data structure that records identifier metadata: name, data type, current scope level, declaration position, and initialization status.',
      'The semantic analyzer traverses the AST, performing type checking, verifying that variables are declared before use, prohibiting duplicate declarations in the same scope, and confirming condition expressions resolve to booleans.'
    ],
    keyConcepts: [
      'Symbol Table Design & Scope Stacks',
      'Static Type Checking & Type Inference',
      'Type Compatibility & Coercion (Int to Float widening)',
      'Scope Resolution (Global vs Local blocks)'
    ],
    diagram: `AST Node: Assignment (counter = "test")
                    |
                    v
    Check Symbol Table: 'counter' -> Type: int
    Check Expression Type: "test" -> Type: string
                    |
                    v
    [TYPE MISMATCH ERROR]: Cannot assign 'string' to variable of type 'int'`,
    exampleCode: `int base = 100;
int multiplier = 2;
int total = base * multiplier;
print(total);`,
    vivaQuestions: [
      {
        q: 'What is a Symbol Table and why is it necessary?',
        a: 'A symbol table is a compile-time dictionary used to record information about identifiers (variables, functions, types, scopes). It is essential for verifying declarations, enforcing type safety, and computing memory offsets.'
      },
      {
        q: 'What are static vs dynamic semantics?',
        a: 'Static semantics can be verified at compile time without running the code (e.g. type compatibility, variable declaration). Dynamic semantics define program behavior during execution (e.g. division by zero, null pointer dereferences).'
      }
    ]
  },
  {
    id: 'ir',
    phaseNumber: 4,
    title: 'Phase 4: Intermediate Code Generation',
    tagline: 'Translating high-level AST constructs into linear Three Address Code.',
    content: [
      'Intermediate Code Generation bridges the gap between high-level language abstractions and machine-specific assembly. It creates a machine-independent, linear representation of the computation.',
      'The most widely adopted form of IR in educational compilers is Three Address Code (TAC). In TAC, each instruction has at most one operator and at most three address fields: `result = arg1 op arg2`.',
      'Complex expressions are broken down using synthetic temporary variables (`t1`, `t2`, `...`), and control flow structures (`if`, `while`) are translated into conditional jumps (`if_false ... goto`) and labels.'
    ],
    keyConcepts: [
      'Three Address Code (TAC) Quads & Triples',
      'Temporary Variable Allocation',
      'Linearization of Tree-Structured Control Flow',
      'Machine Independence of IR'
    ],
    diagram: `High-Level Code:
x = a + b * c;

Three Address Code (TAC):
t1 = b * c          ; Multiply first due to precedence
t2 = a + t1         ; Add to 'a'
x = t2              ; Store into destination variable`,
    exampleCode: `int x = 5;
int y = 10;
int z = 15;
int ans = x * y + z;
print(ans);`,
    vivaQuestions: [
      {
        q: 'Why do modern compilers generate intermediate code instead of going straight to assembly?',
        a: 'IR decouples the source language from target hardware. It enables machine-independent optimizations that can be reused across all target architectures, and reduces the complexity of supporting multiple source languages and target architectures.'
      },
      {
        q: 'What are the main representations of Three Address Code?',
        a: 'The three principal representations are: Quadruples (op, arg1, arg2, result), Triples (op, arg1, arg2 with results referenced by instruction index), and Indirect Triples (pointers to a table of triples).'
      }
    ]
  },
  {
    id: 'optimization',
    phaseNumber: 5,
    title: 'Phase 5: Code Optimization',
    tagline: 'Eliminating redundancies and accelerating execution speed.',
    content: [
      'Code Optimization transforms intermediate code into a more efficient version that executes faster, consumes less memory, and draws less power—without altering the observable output of the program.',
      'Our engine applies four foundational optimization passes: Constant Folding (evaluating compile-time arithmetic), Constant Propagation (substituting known values downstream), Algebraic Simplification (identity reductions like `x + 0` and `x * 1`), and Dead Code Elimination (pruning unused variables).',
      'These transformations are demonstrated live in Compiler Quest with side-by-side diffs and quantifiable reduction percentages.'
    ],
    keyConcepts: [
      'Constant Folding vs Constant Propagation',
      'Algebraic Simplification Rules',
      'Dead Code Elimination (Liveness Analysis)',
      'Basic Blocks and Control Flow Graphs (CFG)'
    ],
    diagram: `Before Optimization:                 After Optimization:
t1 = 10 * 2                          x = 20
x = t1                               y = 20
t2 = x + 0                           (Reduction: 50% fewer instructions)
y = t2`,
    exampleCode: `int a = 10 * 2;
int b = a + 0;
int c = b * 1;
int unused = 999;
int d = c + 5;
print(d);`,
    vivaQuestions: [
      {
        q: 'What is Constant Folding and how does it differ from Constant Propagation?',
        a: 'Constant Folding is the evaluation of operations whose operands are known constants at compile time (e.g. 3 + 4 -> 7). Constant Propagation replaces occurrences of variables with known constant values from earlier assignments.'
      },
      {
        q: 'What is a Basic Block in compiler design?',
        a: 'A Basic Block is a sequence of straight-line instructions with one entry point (no jumps into the middle) and one exit point (no branches except at the end). It forms the fundamental unit for local optimizations.'
      }
    ]
  },
  {
    id: 'codegen',
    phaseNumber: 6,
    title: 'Phase 6: Target Code Generation',
    tagline: 'Synthesizing target machine instructions and allocating physical registers.',
    content: [
      'The final phase of the compilation pipeline translates optimized intermediate code into target machine code or assembly instructions.',
      'This requires mapping infinite conceptual temporary variables onto a finite pool of physical CPU registers (`R1`, `R2`, `R3`, `R4`), an algorithm known as Register Allocation.',
      'When the number of active variables exceeds the available register pool, the code generator emits SPILL and RELOAD instructions to preserve values in main memory. Clear annotations are included to illustrate hardware interaction.'
    ],
    keyConcepts: [
      'Instruction Selection',
      'Register Allocation & Register Spilling',
      'Memory Addressing Modes ([var_name] vs Immediate)',
      'Calling Conventions & HALT instructions'
    ],
    diagram: `TAC:
c = a + b

Target Pseudo-Assembly:
LOAD  R1, [a]       ; Load variable a into R1
LOAD  R2, [b]       ; Load variable b into R2
ADD   R1, R2        ; Compute sum in R1
STORE R1, [c]       ; Save R1 into memory address c`,
    exampleCode: `int a = 25;
int b = 75;
int total = a + b;
print(total);`,
    vivaQuestions: [
      {
        q: 'What is Register Allocation and why is it NP-complete?',
        a: 'Register allocation assigns program variables and temporaries to a finite set of hardware registers. It is modeled as a Graph Coloring problem (where variables are nodes and interference/simultaneous liveness forms edges), which is NP-complete for K >= 3 colors.'
      },
      {
        q: 'What is Register Spilling?',
        a: 'When all CPU registers are occupied and an additional register is required for a computation, the compiler must select a register, write its current value out to memory (spilling), and reuse the register.'
      }
    ]
  }
];
