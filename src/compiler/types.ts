// Core Compiler Types for Compiler Quest

export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'OPERATOR'
  | 'DELIMITER'
  | 'BOOLEAN'
  | 'COMMENT'
  | 'UNKNOWN';

export interface Token {
  type: TokenType;
  lexeme: string;
  literal?: string | number | boolean | null;
  line: number;
  column: number;
  explanation?: string;
}

export type DataType = 'int' | 'float' | 'string' | 'boolean' | 'unknown' | 'void';

export type ASTNodeType =
  | 'Program'
  | 'VariableDeclaration'
  | 'Assignment'
  | 'BinaryExpression'
  | 'UnaryExpression'
  | 'Literal'
  | 'Identifier'
  | 'IfStatement'
  | 'WhileStatement'
  | 'PrintStatement'
  | 'BlockStatement';

export interface BaseASTNode {
  type: ASTNodeType;
  line: number;
  column: number;
}

export interface LiteralNode extends BaseASTNode {
  type: 'Literal';
  valueType: DataType;
  value: any;
  raw: string;
}

export interface IdentifierNode extends BaseASTNode {
  type: 'Identifier';
  name: string;
}

export interface BinaryExpressionNode extends BaseASTNode {
  type: 'BinaryExpression';
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface UnaryExpressionNode extends BaseASTNode {
  type: 'UnaryExpression';
  operator: string;
  operand: ExpressionNode;
}

export type ExpressionNode =
  | LiteralNode
  | IdentifierNode
  | BinaryExpressionNode
  | UnaryExpressionNode;

export interface VariableDeclarationNode extends BaseASTNode {
  type: 'VariableDeclaration';
  varType: DataType;
  name: string;
  init?: ExpressionNode;
}

export interface AssignmentNode extends BaseASTNode {
  type: 'Assignment';
  name: string;
  value: ExpressionNode;
}

export interface PrintStatementNode extends BaseASTNode {
  type: 'PrintStatement';
  argument: ExpressionNode;
}

export interface IfStatementNode extends BaseASTNode {
  type: 'IfStatement';
  condition: ExpressionNode;
  thenBranch: StatementNode[];
  elseBranch?: StatementNode[];
}

export interface WhileStatementNode extends BaseASTNode {
  type: 'WhileStatement';
  condition: ExpressionNode;
  body: StatementNode[];
}

export interface BlockStatementNode extends BaseASTNode {
  type: 'BlockStatement';
  statements: StatementNode[];
}

export type StatementNode =
  | VariableDeclarationNode
  | AssignmentNode
  | PrintStatementNode
  | IfStatementNode
  | WhileStatementNode
  | BlockStatementNode;

export interface ProgramNode extends BaseASTNode {
  type: 'Program';
  statements: StatementNode[];
}

export interface SymbolEntry {
  name: string;
  type: DataType;
  value?: any;
  scope: string;
  line: number;
  column: number;
  initialized: boolean;
}

export type CompilerPhase =
  | 'lexical'
  | 'syntax'
  | 'semantic'
  | 'ir'
  | 'optimization'
  | 'codegen';

export interface CompilerError {
  phase: CompilerPhase;
  line: number;
  column: number;
  message: string;
  expected?: string;
  actual?: string;
  suggestion?: string;
}

export interface TACInstruction {
  id: number;
  op: string; // '=', '+', '-', '*', '/', '%', '==', '!=', '<', '>', '<=', '>=', 'LABEL', 'IF_FALSE_GOTO', 'GOTO', 'PRINT'
  arg1?: string;
  arg2?: string;
  result?: string;
  comment?: string;
}

export interface TargetInstruction {
  line: number;
  opcode: string; // LOAD, STORE, ADD, SUB, MUL, DIV, CMP, JMP, JEQ, JNE, JLT, JGT, PRINT, LABEL
  operands: string[];
  comment?: string;
}

export interface OptimizationPassStats {
  constantFoldingCount: number;
  constantPropagationCount: number;
  algebraicSimplificationCount: number;
  deadCodeCount: number;
  initialInstructions: number;
  optimizedInstructions: number;
  reductionPercentage: number;
  notes: string[];
}

export interface CompilationResult {
  success: boolean;
  tokens: Token[];
  ast: ProgramNode | null;
  symbolTable: SymbolEntry[];
  tac: TACInstruction[];
  optimizedTac: TACInstruction[];
  targetCode: TargetInstruction[];
  errors: CompilerError[];
  optimizationStats: OptimizationPassStats;
  executionTimeMs: number;
  phaseProgress: {
    lexical: boolean;
    syntax: boolean;
    semantic: boolean;
    ir: boolean;
    optimization: boolean;
    codegen: boolean;
  };
}
