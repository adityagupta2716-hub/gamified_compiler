import { Token, TokenType, CompilerError } from './types';

const KEYWORDS = new Set([
  'int',
  'float',
  'string',
  'boolean',
  'if',
  'else',
  'while',
  'print',
  'return',
]);

const BOOLEAN_LITERALS = new Set(['true', 'false']);

export interface LexerResult {
  tokens: Token[];
  errors: CompilerError[];
}

export class Lexer {
  private source: string;
  private tokens: Token[] = [];
  private errors: CompilerError[] = [];
  private start = 0;
  private current = 0;
  private line = 1;
  private column = 1;
  private tokenStartColumn = 1;

  constructor(source: string) {
    this.source = source;
  }

  public tokenize(): LexerResult {
    this.tokens = [];
    this.errors = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.column = 1;

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.tokenStartColumn = this.column;
      this.scanToken();
    }

    return {
      tokens: this.tokens,
      errors: this.errors,
    };
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    const char = this.source.charAt(this.current);
    this.current++;
    this.column++;
    return char;
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    this.column++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  private scanToken(): void {
    const c = this.advance();

    switch (c) {
      // Delimiters
      case '(':
        this.addToken('DELIMITER', '(');
        break;
      case ')':
        this.addToken('DELIMITER', ')');
        break;
      case '{':
        this.addToken('DELIMITER', '{');
        break;
      case '}':
        this.addToken('DELIMITER', '}');
        break;
      case ';':
        this.addToken('DELIMITER', ';');
        break;
      case ',':
        this.addToken('DELIMITER', ',');
        break;

      // Operators
      case '+':
        this.addToken('OPERATOR', '+');
        break;
      case '-':
        this.addToken('OPERATOR', '-');
        break;
      case '*':
        this.addToken('OPERATOR', '*');
        break;
      case '%':
        this.addToken('OPERATOR', '%');
        break;

      // Division or Comment
      case '/':
        if (this.match('/')) {
          // Single-line comment
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
          const commentText = this.source.substring(this.start, this.current);
          this.addToken('COMMENT', commentText);
        } else if (this.match('*')) {
          // Multi-line comment
          const commentStartLine = this.line;
          const commentStartCol = this.tokenStartColumn;
          let terminated = false;
          while (!this.isAtEnd()) {
            if (this.peek() === '\n') {
              this.line++;
              this.column = 0;
            }
            if (this.peek() === '*' && this.peekNext() === '/') {
              this.advance(); // consume *
              this.advance(); // consume /
              terminated = true;
              break;
            }
            this.advance();
          }

          if (!terminated) {
            this.errors.push({
              phase: 'lexical',
              line: commentStartLine,
              column: commentStartCol,
              message: 'Unterminated multi-line comment',
              suggestion: 'Add "*/" to close the comment block.',
            });
          } else {
            const commentText = this.source.substring(this.start, this.current);
            this.addToken('COMMENT', commentText);
          }
        } else {
          this.addToken('OPERATOR', '/');
        }
        break;

      // Comparison / Assignment
      case '=':
        if (this.match('=')) {
          this.addToken('OPERATOR', '==');
        } else {
          this.addToken('OPERATOR', '=');
        }
        break;

      case '!':
        if (this.match('=')) {
          this.addToken('OPERATOR', '!=');
        } else {
          this.addToken('OPERATOR', '!');
        }
        break;

      case '<':
        if (this.match('=')) {
          this.addToken('OPERATOR', '<=');
        } else {
          this.addToken('OPERATOR', '<');
        }
        break;

      case '>':
        if (this.match('=')) {
          this.addToken('OPERATOR', '>=');
        } else {
          this.addToken('OPERATOR', '>');
        }
        break;

      case '&':
        if (this.match('&')) {
          this.addToken('OPERATOR', '&&');
        } else {
          this.addUnknownToken('&', 'Single "&" is not supported. Did you mean "&&"?');
        }
        break;

      case '|':
        if (this.match('|')) {
          this.addToken('OPERATOR', '||');
        } else {
          this.addUnknownToken('|', 'Single "|" is not supported. Did you mean "||"?');
        }
        break;

      // Whitespace
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;

      case '\n':
        this.line++;
        this.column = 1;
        break;

      // String literal
      case '"':
        this.string();
        break;

      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          this.addUnknownToken(c, `Unexpected character '${c}'.`);
        }
        break;
    }
  }

  private string(): void {
    const strStartCol = this.tokenStartColumn;
    const strStartLine = this.line;
    let value = '';

    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      if (this.peek() === '\\' && this.peekNext() === '"') {
        this.advance(); // consume \
        value += '"';
        this.advance(); // consume "
      } else if (this.peek() === '\\' && this.peekNext() === 'n') {
        this.advance();
        value += '\n';
        this.advance();
      } else {
        value += this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.errors.push({
        phase: 'lexical',
        line: strStartLine,
        column: strStartCol,
        message: 'Unterminated string literal',
        suggestion: 'Add a closing double-quote (") to terminate the string.',
      });
      return;
    }

    // The closing "
    this.advance();

    const lexeme = this.source.substring(this.start, this.current);
    this.tokens.push({
      type: 'STRING',
      lexeme,
      literal: value,
      line: strStartLine,
      column: strStartCol,
      explanation: `String literal with ${value.length} characters`,
    });
  }

  private number(): void {
    let isFloat = false;

    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for fractional part
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      isFloat = true;
      // Consume the '.'
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const text = this.source.substring(this.start, this.current);
    const numValue = isFloat ? parseFloat(text) : parseInt(text, 10);

    this.tokens.push({
      type: 'NUMBER',
      lexeme: text,
      literal: numValue,
      line: this.line,
      column: this.tokenStartColumn,
      explanation: isFloat ? `Floating-point number: ${numValue}` : `Integer number: ${numValue}`,
    });
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);

    if (BOOLEAN_LITERALS.has(text)) {
      this.tokens.push({
        type: 'BOOLEAN',
        lexeme: text,
        literal: text === 'true',
        line: this.line,
        column: this.tokenStartColumn,
        explanation: `Boolean literal: ${text}`,
      });
    } else if (KEYWORDS.has(text)) {
      this.tokens.push({
        type: 'KEYWORD',
        lexeme: text,
        line: this.line,
        column: this.tokenStartColumn,
        explanation: `Language keyword: '${text}'`,
      });
    } else {
      this.tokens.push({
        type: 'IDENTIFIER',
        lexeme: text,
        line: this.line,
        column: this.tokenStartColumn,
        explanation: `User identifier: '${text}'`,
      });
    }
  }

  private addUnknownToken(char: string, explanation: string): void {
    this.tokens.push({
      type: 'UNKNOWN',
      lexeme: char,
      line: this.line,
      column: this.tokenStartColumn,
      explanation,
    });
    this.errors.push({
      phase: 'lexical',
      line: this.line,
      column: this.tokenStartColumn,
      message: `Lexical Error: Unexpected character '${char}'`,
      actual: char,
      expected: 'Valid language token (keyword, identifier, number, operator)',
      suggestion: `Remove or replace the character '${char}'.`,
    });
  }

  private addToken(type: TokenType, lexeme: string): void {
    let explanation = '';
    switch (type) {
      case 'OPERATOR':
        explanation = `Operator '${lexeme}'`;
        break;
      case 'DELIMITER':
        explanation = `Delimiter '${lexeme}'`;
        break;
      case 'COMMENT':
        explanation = 'Comment block';
        break;
      default:
        explanation = `${type}: ${lexeme}`;
    }

    this.tokens.push({
      type,
      lexeme,
      line: this.line,
      column: this.tokenStartColumn,
      explanation,
    });
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
}
