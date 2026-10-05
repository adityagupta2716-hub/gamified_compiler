# Compiler Quest ⚔️🎓 (`gamified_compiler`)
> **An Interactive Gamified Educational Compiler for 3rd-Year B.Tech Compiler Design**

Compiler Quest is a modern, dark-themed educational web application that allows students to write code in an educational C-like language and visually inspect every stage of a real, non-mocked compiler pipeline—all while progressing through RPG mechanics such as XP, levels, badges, interactive challenges, and multi-stage boss battles.

---

## ⚡ Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

> *(Optional)* Start the backend API server:
> ```bash
> npm run server
> ```
> Open [http://localhost:5000](http://localhost:5000) for the backend API.


### 🌍 Get a Live Public URL (Free Hosting)

#### ✅ Option 1 — GitHub Pages (Recommended, automatic)

1. Push this repo to GitHub (already done ✓)
2. Go to your repo → **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Click **Save**
5. Push any commit — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically
6. Your live link:

   ```
   https://adityagupta2716-hub.github.io/gamified_compiler/
   ```

#### Option 2 — Netlify
Push to GitHub → [app.netlify.com](https://app.netlify.com) → **"Add new site"** → Connect `gamified_compiler` → Deploy ✅

#### Option 3 — Vercel
Push to GitHub → [vercel.com/new](https://vercel.com/new) → Import `gamified_compiler` → Deploy ✅

> `netlify.toml` and `vercel.json` are already included — no extra config needed!

---

## 🌐 Localhost Access Links

When the development servers are running, access the platform locally at:

| Service | Localhost URL | Description |
| :--- | :--- | :--- |
| **Frontend IDE & Quest** | [http://localhost:5173/](http://localhost:5173/) | Interactive Compiler IDE, AST visualizer, challenges, boss fight & dashboard |
| **Backend Express API** | [http://localhost:5000/](http://localhost:5000/) | REST API with user progress, challenges & leaderboard endpoints |
| **API Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Backend status verification endpoint |

---

## 🌟 Key Features

### 1. Genuine 6-Phase Compiler Pipeline
Every phase generates its outputs directly from the user's source code in pure TypeScript in the browser:

```
SOURCE CODE
     ↓
1. LEXICAL ANALYSIS         (Tokens table: type, lexeme, line, col, unknown tokens)
     ↓
2. SYNTAX ANALYSIS          (Recursive-descent parser, dynamic SVG AST visualizer)
     ↓
3. SEMANTIC ANALYSIS        (Scoped Symbol Table, type safety, undeclared/duplicate checks)
     ↓
4. INTERMEDIATE CODE        (Three Address Code quadruples/triples, temporary variables)
     ↓
5. CODE OPTIMIZATION        (Constant folding, propagation, algebraic simplification, DCE)
     ↓
6. TARGET CODE GENERATION   (Educational register-allocated pseudo-assembly)
```

### 2. Gamification & RPG Mechanics
- **8 Mastery Levels**: Advance from *Level 1: Token Rookie* to *Level 8: Compiler Architect*.
- **Anti-Farming XP Engine**: Code hash tracking prevents users from farming unlimited XP by spamming the run button on identical code.
- **10 Unlockable Badges**: *Token Hunter*, *Syntax Solver*, *AST Explorer*, *Semantic Detective*, *IR Builder*, *Optimization Expert*, *Code Generator*, *Compiler Architect*, *Boss Slayer*, and *Compiler Scholar*.
- **Sound Effects**: Synthesized Web Audio API sound effects for compilation, level-up fanfares, achievements, and errors (zero external audio file dependencies).
- **The Compiler Boss ("Malwareus the Broken AST")**: A 5-stage boss battle requiring students to fix lexical glitches, missing semicolons, undeclared variables, IR precedence, and dead code to deplete 500 Boss HP!

### 3. Comprehensive University Study Suite
- **Interactive Practice Arena**: 10 categorized challenges (Lexical, Syntax, Semantic, IR, Optimization, Pipeline) with hints, answers, and explanations.
- **B.Tech Curriculum Textbook**: In-depth theoretical modules aligned with university syllabi, architecture flowcharts, and oral viva exam questions with answers.
- **Diagnostic Explainer**: Clear error cards with Error Type, Line, Column, Expected vs Actual tokens, and actionable "How to Fix" suggestions.
- **8 Preloaded Examples**: *Hello World*, *Addition*, *Variables*, *Arithmetic Expression*, *Conditional Statement*, *Optimization Example*, *Syntax Error Example*, and *Type Error Example*.

---

## 🚀 Quick Start & How to Run

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### Installation & Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/adityagupta2716-hub/gamified_compiler.git
   cd gamified_compiler
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Unit Tests (Verify Compiler Engine)**:
   ```bash
   npm run test:compiler
   ```

4. **Start the Frontend Application**:
   ```bash
   npm run dev
   ```
   Open your browser at **[http://localhost:5173/](http://localhost:5173/)**.

5. **(Optional) Start the Express Backend API**:
   ```bash
   npm run server
   ```
   Backend runs on **[http://localhost:5000/](http://localhost:5000/)** with local in-memory storage and MongoDB compatibility.


---

## 🏛️ Compiler Pipeline Deep-Dive

### Language Specification (C-like)
- **Data Types**: `int`, `float`, `string`, `boolean`
- **Variable Declarations**: `int a = 10; float b = 5.5; string s = "hello";`
- **Arithmetic**: `+`, `-`, `*`, `/`, `%` with standard operator precedence
- **Comparisons**: `==`, `!=`, `<`, `>`, `<=`, `>=`
- **Logical**: `&&`, `||`, `!`
- **Control Flow**: `if (condition) { ... } else { ... }`, `while (condition) { ... }`
- **I/O**: `print(expression);`
- **Comments**: Single-line (`// ...`) and multi-line (`/* ... */`)

### Optimization Passes
1. **Constant Folding**: Evaluates constant arithmetic at compile time (e.g. `t1 = 10 * 2` becomes `t1 = 20`).
2. **Constant Propagation**: Substitutes known constant values downstream into subsequent expressions.
3. **Algebraic Simplification**: Identifies algebraic identities like `x + 0 -> x`, `x * 1 -> x`, `x * 0 -> 0`, `x / 1 -> x`.
4. **Dead Code Elimination (DCE)**: Prunes unreferenced temporary variables and unreachable instructions.

### Target Machine Model
- 4 General Purpose Registers: `R1`, `R2`, `R3`, `R4`
- Instructions: `LOAD`, `STORE`, `ADD`, `SUB`, `MUL`, `DIV`, `CMP`, `JMP`, `JEQ`, `PRINT`, `HALT`
- Register spilling to memory addresses `[var_name]` when register pressure exceeds capacity.

---

## 🎓 5-Minute Demonstration Walkthrough (For Lab / Viva Presentation)

1. **Landing Page**:
   - Showcase the animated 6-phase pipeline banner and overview of Compiler Quest.
   - Click **Start Quest** to enter the Dashboard.

2. **Dashboard**:
   - Show Level 1 (*Token Rookie*), XP progress bar, active streak, and pipeline mastery checklist.
   - Click **Continue Quest** to open the Compiler IDE.

3. **Compiler IDE**:
   - Load the preloaded **Aggressive Optimization** or **Addition** example.
   - Click **Run Pipeline** (`Ctrl+Enter`).
   - Observe the live execution time and build success banner.

4. **Inspect All 6 Compiler Phases**:
   - **Tab 1 (Lexer)**: Inspect generated tokens (Keyword, Identifier, Number, Delimiter, Line/Col).
   - **Tab 2 (Parser)**: Interact with the dynamic SVG Abstract Syntax Tree (zoom in/out, click nodes to view properties).
   - **Tab 3 (Semantic)**: Inspect the Scoped Symbol Table with variable types, values, and scopes.
   - **Tab 4 (TAC IR)**: View the generated Three Address Code in the terminal interface.
   - **Tab 5 (Optimizer)**: Demonstrate the side-by-side Before/After diff and quantifiable reduction stats (e.g., 44% instruction reduction).
   - **Tab 6 (Target Code)**: Review the register-allocated pseudo-assembly with memory addressing comments.

5. **Diagnostic Error Explainer**:
   - Select the **Syntax Error Example** or **Type Mismatch Error** from the example dropdown.
   - Run compilation and show the student-friendly error card showing Line, Column, Expected, Actual, and "How to Fix" advice.

6. **Challenges & Boss Battle**:
   - Navigate to **Challenges** and solve a Lexical or Syntax problem to claim bonus XP.
   - Navigate to **Boss Battle** and deal damage to *Malwareus the Broken AST* across 5 phases to unlock the exclusive *Boss Slayer* badge!

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Canvas Confetti
- **Audio Engine**: Pure synthesized Web Audio API (cross-platform, zero asset files required)
- **Compiler**: Pure TypeScript modular architecture (`lexer.ts`, `parser.ts`, `ast.ts`, `symbolTable.ts`, `semanticAnalyzer.ts`, `intermediateCode.ts`, `optimizer.ts`, `codeGenerator.ts`)
- **Backend API**: Express, Node.js, CORS, with dual In-Memory & MongoDB persistence compatibility

---

## 📄 License & Academic Integrity
Developed as a 3rd-Year B.Tech Computer Science & Engineering Compiler Design project. Designed for conceptual demonstration and university laboratory examinations.
