import {
  ProgramNode,
  StatementNode,
  ExpressionNode,
  DataType,
  CompilerError,
  SymbolEntry,
  VariableDeclarationNode,
  AssignmentNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  LiteralNode,
  IdentifierNode,
  IfStatementNode,
  WhileStatementNode,
  PrintStatementNode,
  BlockStatementNode,
} from './types';
import { SymbolTableManager } from './symbolTable';

export interface SemanticAnalysisResult {
  errors: CompilerError[];
  symbolTable: SymbolEntry[];
}

export class SemanticAnalyzer {
  private symTable: SymbolTableManager;
  private errors: CompilerError[] = [];

  constructor() {
    this.symTable = new SymbolTableManager();
  }

  public analyze(program: ProgramNode | null): SemanticAnalysisResult {
    this.symTable = new SymbolTableManager();
    this.errors = [];

    if (!program) {
      return { errors: this.errors, symbolTable: [] };
    }

    for (const stmt of program.statements) {
      this.analyzeStatement(stmt);
    }

    return {
      errors: this.errors,
      symbolTable: this.symTable.getAllSymbols(),
    };
  }

  private analyzeStatement(stmt: StatementNode): void {
    switch (stmt.type) {
      case 'VariableDeclaration':
        this.analyzeVarDecl(stmt as VariableDeclarationNode);
        break;
      case 'Assignment':
        this.analyzeAssignment(stmt as AssignmentNode);
        break;
      case 'PrintStatement':
        this.analyzePrint(stmt as PrintStatementNode);
        break;
      case 'IfStatement':
        this.analyzeIf(stmt as IfStatementNode);
        break;
      case 'WhileStatement':
        this.analyzeWhile(stmt as WhileStatementNode);
        break;
      case 'BlockStatement':
        this.analyzeBlock(stmt as BlockStatementNode);
        break;
    }
  }

  private analyzeVarDecl(decl: VariableDeclarationNode): void {
    let initType: DataType | null = null;
    let initVal: any = undefined;

    if (decl.init) {
      const exprRes = this.inferExpressionType(decl.init);
      initType = exprRes.type;
      initVal = exprRes.constantValue;

      // Type checking between declared type and initial value
      if (initType !== 'unknown' && !this.isTypeCompatible(decl.varType, initType)) {
        this.addError(
          decl.line,
          decl.column,
          `Cannot initialize variable '${decl.name}' of type '${decl.varType}' with expression of type '${initType}'.`,
          decl.varType,
          initType,
          `Convert the expression to type '${decl.varType}' or change the variable type.`
        );
      }
    }

    const { success } = this.symTable.define(
      decl.name,
      decl.varType,
      decl.line,
      decl.column,
      initVal,
      decl.init !== undefined
    );

    if (!success) {
      this.addError(
        decl.line,
        decl.column,
        `Duplicate declaration: Variable '${decl.name}' has already been declared in this scope.`,
        'Unique identifier name',
        `'${decl.name}' (already declared)`,
        `Rename the variable '${decl.name}' or remove the duplicate declaration.`
      );
    }
  }

  private analyzeAssignment(assign: AssignmentNode): void {
    const symbol = this.symTable.lookup(assign.name);

    if (!symbol) {
      this.addError(
        assign.line,
        assign.column,
        `Undeclared variable: '${assign.name}' is assigned before declaration.`,
        `Declaration for '${assign.name}'`,
        'Undeclared identifier',
        `Declare variable '${assign.name}' (e.g. 'int ${assign.name};') before assigning to it.`
      );
      // Still infer expression to check internal errors
      this.inferExpressionType(assign.value);
      return;
    }

    const exprRes = this.inferExpressionType(assign.value);

    if (exprRes.type !== 'unknown' && !this.isTypeCompatible(symbol.type, exprRes.type)) {
      this.addError(
        assign.line,
        assign.column,
        `Type Mismatch: Cannot assign '${exprRes.type}' to variable '${assign.name}' of type '${symbol.type}'.`,
        symbol.type,
        exprRes.type,
        `Ensure the assigned value is compatible with '${symbol.type}'.`
      );
    } else {
      this.symTable.update(assign.name, exprRes.constantValue);
    }
  }

  private analyzePrint(stmt: PrintStatementNode): void {
    this.inferExpressionType(stmt.argument);
  }

  private analyzeIf(stmt: IfStatementNode): void {
    const condRes = this.inferExpressionType(stmt.condition);
    if (condRes.type !== 'unknown' && condRes.type !== 'boolean' && condRes.type !== 'int') {
      this.addError(
        stmt.line,
        stmt.column,
        `Condition in 'if' statement must evaluate to boolean, but got '${condRes.type}'.`,
        'boolean',
        condRes.type,
        'Use a comparison operator (==, !=, <, >, <=, >=) or a boolean variable.'
      );
    }

    this.symTable.enterScope('if_then');
    for (const s of stmt.thenBranch) {
      this.analyzeStatement(s);
    }
    this.symTable.exitScope();

    if (stmt.elseBranch) {
      this.symTable.enterScope('if_else');
      for (const s of stmt.elseBranch) {
        this.analyzeStatement(s);
      }
      this.symTable.exitScope();
    }
  }

  private analyzeWhile(stmt: WhileStatementNode): void {
    const condRes = this.inferExpressionType(stmt.condition);
    if (condRes.type !== 'unknown' && condRes.type !== 'boolean' && condRes.type !== 'int') {
      this.addError(
        stmt.line,
        stmt.column,
        `Condition in 'while' loop must evaluate to boolean, but got '${condRes.type}'.`,
        'boolean',
        condRes.type,
        'Use a comparison operator in the loop condition.'
      );
    }

    this.symTable.enterScope('while_body');
    for (const s of stmt.body) {
      this.analyzeStatement(s);
    }
    this.symTable.exitScope();
  }

  private analyzeBlock(stmt: BlockStatementNode): void {
    this.symTable.enterScope('block');
    for (const s of stmt.statements) {
      this.analyzeStatement(s);
    }
    this.symTable.exitScope();
  }

  // Type Inference & Expression Semantics

  private inferExpressionType(expr: ExpressionNode): { type: DataType; constantValue?: any } {
    switch (expr.type) {
      case 'Literal': {
        const lit = expr as LiteralNode;
        return { type: lit.valueType, constantValue: lit.value };
      }

      case 'Identifier': {
        const id = expr as IdentifierNode;
        const symbol = this.symTable.lookup(id.name);
        if (!symbol) {
          this.addError(
            id.line,
            id.column,
            `Undeclared variable: '${id.name}' is used before declaration.`,
            `Variable '${id.name}' declared in scope`,
            'Undefined identifier',
            `Declare '${id.name}' before referencing it in an expression.`
          );
          return { type: 'unknown' };
        }
        if (!symbol.initialized && symbol.value === null) {
          // Warning/notice
        }
        return { type: symbol.type, constantValue: symbol.value };
      }

      case 'UnaryExpression': {
        const un = expr as UnaryExpressionNode;
        const operandRes = this.inferExpressionType(un.operand);

        if (un.operator === '!') {
          if (operandRes.type !== 'boolean' && operandRes.type !== 'unknown') {
            this.addError(
              un.line,
              un.column,
              `Operator '!' cannot be applied to type '${operandRes.type}'.`,
              'boolean',
              operandRes.type,
              "Logical NOT '!' is only valid for boolean expressions."
            );
          }
          return {
            type: 'boolean',
            constantValue: operandRes.constantValue !== undefined ? !operandRes.constantValue : undefined,
          };
        }

        if (un.operator === '-' || un.operator === '+') {
          if (operandRes.type !== 'int' && operandRes.type !== 'float' && operandRes.type !== 'unknown') {
            this.addError(
              un.line,
              un.column,
              `Unary operator '${un.operator}' cannot be applied to type '${operandRes.type}'.`,
              'int or float',
              operandRes.type,
              `Unary '${un.operator}' requires a numeric operand.`
            );
          }
          const sign = un.operator === '-' ? -1 : 1;
          return {
            type: operandRes.type,
            constantValue: operandRes.constantValue !== undefined ? sign * operandRes.constantValue : undefined,
          };
        }

        return { type: operandRes.type };
      }

      case 'BinaryExpression': {
        const bin = expr as BinaryExpressionNode;
        const leftRes = this.inferExpressionType(bin.left);
        const rightRes = this.inferExpressionType(bin.right);

        // If either is unknown, pass through
        if (leftRes.type === 'unknown' || rightRes.type === 'unknown') {
          return { type: 'unknown' };
        }

        // Relational & Equality operators
        if (['==', '!='].includes(bin.operator)) {
          if (leftRes.type !== rightRes.type && !(this.isNumeric(leftRes.type) && this.isNumeric(rightRes.type))) {
            this.addError(
              bin.line,
              bin.column,
              `Cannot compare operands of different types '${leftRes.type}' and '${rightRes.type}' with '${bin.operator}'.`,
              'Matching operand types',
              `${leftRes.type} vs ${rightRes.type}`,
              'Ensure both sides of comparison have compatible types.'
            );
          }
          return { type: 'boolean' };
        }

        if (['<', '<=', '>', '>='].includes(bin.operator)) {
          if (!this.isNumeric(leftRes.type) || !this.isNumeric(rightRes.type)) {
            this.addError(
              bin.line,
              bin.column,
              `Relational operator '${bin.operator}' is only valid for numeric types, but received '${leftRes.type}' and '${rightRes.type}'.`,
              'int or float',
              `${leftRes.type} and ${rightRes.type}`,
              'Use numeric expressions for order comparisons.'
            );
          }
          return { type: 'boolean' };
        }

        // Logical operators
        if (['&&', '||'].includes(bin.operator)) {
          if (leftRes.type !== 'boolean' || rightRes.type !== 'boolean') {
            this.addError(
              bin.line,
              bin.column,
              `Logical operator '${bin.operator}' requires boolean operands, got '${leftRes.type}' and '${rightRes.type}'.`,
              'boolean && boolean',
              `${leftRes.type} ${bin.operator} ${rightRes.type}`,
              'Use boolean expressions or conditions with logical operators.'
            );
          }
          return { type: 'boolean' };
        }

        // Arithmetic operators: +, -, *, /, %
        if (bin.operator === '+') {
          // String concatenation or numeric addition
          if (leftRes.type === 'string' || rightRes.type === 'string') {
            return { type: 'string' };
          }
          if (leftRes.type === 'float' || rightRes.type === 'float') {
            return { type: 'float' };
          }
          if (leftRes.type === 'int' && rightRes.type === 'int') {
            return { type: 'int' };
          }
          this.addError(
            bin.line,
            bin.column,
            `Operator '+' cannot be applied to types '${leftRes.type}' and '${rightRes.type}'.`,
            'numeric or string',
            `${leftRes.type} + ${rightRes.type}`,
            'Ensure operands are numbers or strings.'
          );
          return { type: 'unknown' };
        }

        if (['-', '*', '/'].includes(bin.operator)) {
          if (!this.isNumeric(leftRes.type) || !this.isNumeric(rightRes.type)) {
            this.addError(
              bin.line,
              bin.column,
              `Operator '${bin.operator}' requires numeric operands, but received '${leftRes.type}' and '${rightRes.type}'.`,
              'int or float',
              `${leftRes.type} ${bin.operator} ${rightRes.type}`,
              `Ensure both operands are numbers.`
            );
            return { type: 'unknown' };
          }
          if (leftRes.type === 'float' || rightRes.type === 'float' || bin.operator === '/') {
            // Note: division can result in float if either is float or standard division
            return { type: leftRes.type === 'float' || rightRes.type === 'float' ? 'float' : 'int' };
          }
          return { type: 'int' };
        }

        if (bin.operator === '%') {
          if (leftRes.type !== 'int' || rightRes.type !== 'int') {
            this.addError(
              bin.line,
              bin.column,
              `Modulo operator '%' requires integer operands, but received '${leftRes.type}' and '${rightRes.type}'.`,
              'int % int',
              `${leftRes.type} % ${rightRes.type}`,
              'Use integers with modulo operator.'
            );
          }
          return { type: 'int' };
        }

        return { type: 'unknown' };
      }

      default:
        return { type: 'unknown' };
    }
  }

  private isNumeric(type: DataType): boolean {
    return type === 'int' || type === 'float';
  }

  private isTypeCompatible(target: DataType, source: DataType): boolean {
    if (target === source) return true;
    // Widening from int to float allowed
    if (target === 'float' && source === 'int') return true;
    return false;
  }

  private addError(
    line: number,
    column: number,
    message: string,
    expected?: string,
    actual?: string,
    suggestion?: string
  ): void {
    this.errors.push({
      phase: 'semantic',
      line,
      column,
      message: `Semantic Error: ${message}`,
      expected,
      actual,
      suggestion,
    });
  }
}
