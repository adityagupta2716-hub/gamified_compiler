import {
  Token,
  TokenType,
  CompilerError,
  ProgramNode,
  StatementNode,
  ExpressionNode,
  DataType,
} from './types';
import {
  createProgram,
  createVarDecl,
  createAssignment,
  createBinaryExpr,
  createUnaryExpr,
  createLiteral,
  createIdentifier,
  createIf,
  createWhile,
  createPrint,
  createBlock,
} from './ast';

export interface ParserResult {
  ast: ProgramNode | null;
  errors: CompilerError[];
}

export class Parser {
  private tokens: Token[];
  private current = 0;
  private errors: CompilerError[] = [];

  constructor(tokens: Token[]) {
    // Filter out comments from syntactic analysis
    this.tokens = tokens.filter((t) => t.type !== 'COMMENT');
  }

  public parse(): ParserResult {
    this.current = 0;
    this.errors = [];
    const statements: StatementNode[] = [];

    const startLine = this.tokens[0]?.line || 1;
    const startCol = this.tokens[0]?.column || 1;

    while (!this.isAtEnd()) {
      try {
        const stmt = this.declarationOrStatement();
        if (stmt) {
          statements.push(stmt);
        }
      } catch (err: any) {
        this.synchronize();
      }
    }

    return {
      ast: this.errors.length > 0 && statements.length === 0 ? null : createProgram(statements, startLine, startCol),
      errors: this.errors,
    };
  }

  private declarationOrStatement(): StatementNode | null {
    if (this.matchKeyword('int') || this.matchKeyword('float') || this.matchKeyword('string') || this.matchKeyword('boolean')) {
      const typeToken = this.previous();
      return this.varDeclaration(typeToken.lexeme as DataType);
    }

    return this.statement();
  }

  private varDeclaration(varType: DataType): StatementNode {
    const idToken = this.consume('IDENTIFIER', "Expected variable name after type specifier.");
    const line = idToken.line;
    const col = idToken.column;

    let init: ExpressionNode | undefined = undefined;

    if (this.matchOperator('=')) {
      init = this.expression();
    }

    this.consumeDelimiter(';', "Expected ';' after variable declaration.");

    return createVarDecl(varType, idToken.lexeme, init, line, col);
  }

  private statement(): StatementNode {
    if (this.matchKeyword('if')) {
      return this.ifStatement();
    }
    if (this.matchKeyword('while')) {
      return this.whileStatement();
    }
    if (this.matchKeyword('print')) {
      return this.printStatement();
    }
    if (this.matchDelimiter('{')) {
      return this.blockStatement();
    }

    return this.assignmentOrExprStatement();
  }

  private ifStatement(): StatementNode {
    const ifToken = this.previous();
    this.consumeDelimiter('(', "Expected '(' after 'if'.");
    const condition = this.expression();
    this.consumeDelimiter(')', "Expected ')' after if condition.");

    const thenBranch = this.statementToList(this.statement());
    let elseBranch: StatementNode[] | undefined = undefined;

    if (this.matchKeyword('else')) {
      elseBranch = this.statementToList(this.statement());
    }

    return createIf(condition, thenBranch, elseBranch, ifToken.line, ifToken.column);
  }

  private whileStatement(): StatementNode {
    const whileToken = this.previous();
    this.consumeDelimiter('(', "Expected '(' after 'while'.");
    const condition = this.expression();
    this.consumeDelimiter(')', "Expected ')' after while condition.");

    const body = this.statementToList(this.statement());
    return createWhile(condition, body, whileToken.line, whileToken.column);
  }

  private printStatement(): StatementNode {
    const printToken = this.previous();
    this.consumeDelimiter('(', "Expected '(' after 'print'.");
    const arg = this.expression();
    this.consumeDelimiter(')', "Expected ')' after print argument.");
    this.consumeDelimiter(';', "Expected ';' after print statement.");

    return createPrint(arg, printToken.line, printToken.column);
  }

  private blockStatement(): StatementNode {
    const braceToken = this.previous();
    const statements: StatementNode[] = [];

    while (!this.checkDelimiter('}') && !this.isAtEnd()) {
      const stmt = this.declarationOrStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    this.consumeDelimiter('}', "Expected '}' to close block.");
    return createBlock(statements, braceToken.line, braceToken.column);
  }

  private statementToList(stmt: StatementNode): StatementNode[] {
    if (stmt.type === 'BlockStatement') {
      return (stmt as any).statements;
    }
    return [stmt];
  }

  private assignmentOrExprStatement(): StatementNode {
    const token = this.peek();

    if (token.type === 'IDENTIFIER') {
      const idToken = this.advance();
      if (this.matchOperator('=')) {
        const val = this.expression();
        this.consumeDelimiter(';', "Expected ';' after assignment.");
        return createAssignment(idToken.lexeme, val, idToken.line, idToken.column);
      } else {
        // If not assignment, rewind and fail gracefully
        this.current--;
      }
    }

    const unexpected = this.peek();
    throw this.error(
      unexpected,
      `Unexpected token '${unexpected.lexeme}'. Expected statement, assignment, or declaration.`,
      'Valid statement such as assignment, declaration, or print',
      unexpected.lexeme,
      'Check for missing semicolon on previous line, or check statement syntax.'
    );
  }

  // Expression Parsing with Operator Precedence

  private expression(): ExpressionNode {
    return this.logicalOr();
  }

  private logicalOr(): ExpressionNode {
    let expr = this.logicalAnd();

    while (this.matchOperator('||')) {
      const op = this.previous().lexeme;
      const right = this.logicalAnd();
      expr = createBinaryExpr(expr, op, right, expr.line, expr.column);
    }

    return expr;
  }

  private logicalAnd(): ExpressionNode {
    let expr = this.equality();

    while (this.matchOperator('&&')) {
      const op = this.previous().lexeme;
      const right = this.equality();
      expr = createBinaryExpr(expr, op, right, expr.line, expr.column);
    }

    return expr;
  }

  private equality(): ExpressionNode {
    let expr = this.relational();

    while (this.matchOperator('==') || this.matchOperator('!=')) {
      const op = this.previous().lexeme;
      const right = this.relational();
      expr = createBinaryExpr(expr, op, right, expr.line, expr.column);
    }

    return expr;
  }

  private relational(): ExpressionNode {
    let expr = this.additive();

    while (
      this.matchOperator('<') ||
      this.matchOperator('<=') ||
      this.matchOperator('>') ||
      this.matchOperator('>=')
    ) {
      const op = this.previous().lexeme;
      const right = this.additive();
      expr = createBinaryExpr(expr, op, right, expr.line, expr.column);
    }

    return expr;
  }

  private additive(): ExpressionNode {
    let expr = this.multiplicative();

    while (this.matchOperator('+') || this.matchOperator('-')) {
      const op = this.previous().lexeme;
      const right = this.multiplicative();
      expr = createBinaryExpr(expr, op, right, expr.line, expr.column);
    }

    return expr;
  }

  private multiplicative(): ExpressionNode {
    let expr = this.unary();

    while (this.matchOperator('*') || this.matchOperator('/') || this.matchOperator('%')) {
      const op = this.previous().lexeme;
      const right = this.unary();
      expr = createBinaryExpr(expr, op, right, expr.line, expr.column);
    }

    return expr;
  }

  private unary(): ExpressionNode {
    if (this.matchOperator('!') || this.matchOperator('-') || this.matchOperator('+')) {
      const op = this.previous();
      const operand = this.unary();
      return createUnaryExpr(op.lexeme, operand, op.line, op.column);
    }

    return this.primary();
  }

  private primary(): ExpressionNode {
    if (this.matchType('NUMBER')) {
      const tok = this.previous();
      const isFloat = tok.lexeme.includes('.');
      return createLiteral(isFloat ? 'float' : 'int', tok.literal, tok.lexeme, tok.line, tok.column);
    }

    if (this.matchType('STRING')) {
      const tok = this.previous();
      return createLiteral('string', tok.literal, tok.lexeme, tok.line, tok.column);
    }

    if (this.matchType('BOOLEAN')) {
      const tok = this.previous();
      return createLiteral('boolean', tok.literal, tok.lexeme, tok.line, tok.column);
    }

    if (this.matchType('IDENTIFIER')) {
      const tok = this.previous();
      return createIdentifier(tok.lexeme, tok.line, tok.column);
    }

    if (this.matchDelimiter('(')) {
      const parenTok = this.previous();
      const expr = this.expression();
      this.consumeDelimiter(')', "Expected ')' after parenthesized expression.");
      return expr;
    }

    const token = this.peek();
    throw this.error(
      token,
      `Expected expression, found '${token ? token.lexeme : 'end of input'}'.`,
      'number, string, boolean, identifier, or (expression)',
      token ? token.lexeme : 'EOF',
      'Check for missing operand, unmatched parenthesis, or typo.'
    );
  }

  // Token matching & navigation helpers

  private matchKeyword(keyword: string): boolean {
    if (this.checkKeyword(keyword)) {
      this.advance();
      return true;
    }
    return false;
  }

  private checkKeyword(keyword: string): boolean {
    if (this.isAtEnd()) return false;
    const tok = this.peek();
    return tok.type === 'KEYWORD' && tok.lexeme === keyword;
  }

  private matchOperator(op: string): boolean {
    if (this.checkOperator(op)) {
      this.advance();
      return true;
    }
    return false;
  }

  private checkOperator(op: string): boolean {
    if (this.isAtEnd()) return false;
    const tok = this.peek();
    return tok.type === 'OPERATOR' && tok.lexeme === op;
  }

  private matchDelimiter(delim: string): boolean {
    if (this.checkDelimiter(delim)) {
      this.advance();
      return true;
    }
    return false;
  }

  private checkDelimiter(delim: string): boolean {
    if (this.isAtEnd()) return false;
    const tok = this.peek();
    return tok.type === 'DELIMITER' && tok.lexeme === delim;
  }

  private matchType(type: TokenType): boolean {
    if (this.checkType(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  private checkType(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.checkType(type)) return this.advance();
    const token = this.peek();
    throw this.error(token, message, type, token ? token.type : 'EOF', 'Provide valid identifier name.');
  }

  private consumeDelimiter(delim: string, message: string): Token {
    if (this.checkDelimiter(delim)) return this.advance();
    const token = this.peek();
    const tip = delim === ';' ? "You likely forgot a semicolon ';' at the end of the statement." : `Add '${delim}'.`;
    throw this.error(token, message, `'${delim}'`, token ? `'${token.lexeme}'` : 'EOF', tip);
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): Token {
    return this.tokens[this.current] || {
      type: 'UNKNOWN',
      lexeme: 'EOF',
      line: this.previous()?.line || 1,
      column: (this.previous()?.column || 1) + (this.previous()?.lexeme.length || 1),
    };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private error(
    token: Token | undefined,
    message: string,
    expected?: string,
    actual?: string,
    suggestion?: string
  ): Error {
    const line = token ? token.line : 1;
    const column = token ? token.column : 1;
    const compilerError: CompilerError = {
      phase: 'syntax',
      line,
      column,
      message: `Syntax Error: ${message}`,
      expected,
      actual,
      suggestion,
    };
    this.errors.push(compilerError);
    return new Error(message);
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().lexeme === ';') return;

      switch (this.peek().lexeme) {
        case 'int':
        case 'float':
        case 'string':
        case 'boolean':
        case 'if':
        case 'while':
        case 'print':
          return;
      }

      this.advance();
    }
  }
}
