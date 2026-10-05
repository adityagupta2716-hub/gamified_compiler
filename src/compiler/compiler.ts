import {
  CompilationResult,
  CompilerError,
  Token,
  ProgramNode,
  SymbolEntry,
  TACInstruction,
  TargetInstruction,
  OptimizationPassStats,
} from './types';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { SemanticAnalyzer } from './semanticAnalyzer';
import { IntermediateCodeGenerator } from './intermediateCode';
import { CodeOptimizer } from './optimizer';
import { TargetCodeGenerator } from './codeGenerator';

export class Compiler {
  public static compile(sourceCode: string): CompilationResult {
    const startTime = performance.now();
    const allErrors: CompilerError[] = [];

    // Phase 1: Lexical Analysis
    const lexer = new Lexer(sourceCode);
    const lexerRes = lexer.tokenize();
    allErrors.push(...lexerRes.errors);
    const hasLexicalErrors = lexerRes.errors.length > 0;

    // Phase 2: Syntax Analysis
    let ast: ProgramNode | null = null;
    let hasSyntaxErrors = false;

    if (lexerRes.tokens.length > 0) {
      const parser = new Parser(lexerRes.tokens);
      const parserRes = parser.parse();
      ast = parserRes.ast;
      allErrors.push(...parserRes.errors);
      hasSyntaxErrors = parserRes.errors.length > 0;
    }

    // Phase 3: Semantic Analysis
    let symbolTable: SymbolEntry[] = [];
    let hasSemanticErrors = false;

    if (ast) {
      const semanticAnalyzer = new SemanticAnalyzer();
      const semanticRes = semanticAnalyzer.analyze(ast);
      symbolTable = semanticRes.symbolTable;
      allErrors.push(...semanticRes.errors);
      hasSemanticErrors = semanticRes.errors.length > 0;
    }

    // Phase 4: Intermediate Code Generation (TAC)
    let tac: TACInstruction[] = [];
    const canGenerateIR = ast !== null && !hasSyntaxErrors && !hasSemanticErrors;

    if (canGenerateIR) {
      const irGen = new IntermediateCodeGenerator();
      tac = irGen.generate(ast);
    }

    // Phase 5: Code Optimization
    let optimizedTac: TACInstruction[] = [];
    let optStats: OptimizationPassStats = {
      constantFoldingCount: 0,
      constantPropagationCount: 0,
      algebraicSimplificationCount: 0,
      deadCodeCount: 0,
      initialInstructions: 0,
      optimizedInstructions: 0,
      reductionPercentage: 0,
      notes: [],
    };

    if (tac.length > 0) {
      const optimizer = new CodeOptimizer();
      const optRes = optimizer.optimize(tac);
      optimizedTac = optRes.optimizedTac;
      optStats = optRes.stats;
    }

    // Phase 6: Target Code Generation (Educational Assembly)
    let targetCode: TargetInstruction[] = [];
    if (optimizedTac.length > 0) {
      const codeGen = new TargetCodeGenerator();
      targetCode = codeGen.generate(optimizedTac);
    } else if (tac.length > 0) {
      const codeGen = new TargetCodeGenerator();
      targetCode = codeGen.generate(tac);
    }

    const endTime = performance.now();
    const success = allErrors.length === 0 && targetCode.length > 0;

    return {
      success,
      tokens: lexerRes.tokens,
      ast,
      symbolTable,
      tac,
      optimizedTac,
      targetCode,
      errors: allErrors,
      optimizationStats: optStats,
      executionTimeMs: Math.max(1, Math.round(endTime - startTime)),
      phaseProgress: {
        lexical: lexerRes.tokens.length > 0 && !hasLexicalErrors,
        syntax: ast !== null && !hasSyntaxErrors,
        semantic: ast !== null && !hasSemanticErrors && !hasSyntaxErrors,
        ir: tac.length > 0,
        optimization: optimizedTac.length > 0,
        codegen: targetCode.length > 0,
      },
    };
  }
}
