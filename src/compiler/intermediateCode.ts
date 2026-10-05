import {
  ProgramNode,
  StatementNode,
  ExpressionNode,
  VariableDeclarationNode,
  AssignmentNode,
  PrintStatementNode,
  IfStatementNode,
  WhileStatementNode,
  BlockStatementNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  LiteralNode,
  IdentifierNode,
  TACInstruction,
} from './types';

export class IntermediateCodeGenerator {
  private tempCount = 0;
  private labelCount = 0;
  private instructions: TACInstruction[] = [];
  private instructionId = 1;

  public generate(program: ProgramNode | null): TACInstruction[] {
    this.tempCount = 0;
    this.labelCount = 0;
    this.instructions = [];
    this.instructionId = 1;

    if (!program) return [];

    for (const stmt of program.statements) {
      this.generateStatement(stmt);
    }

    return this.instructions;
  }

  private newTemp(): string {
    this.tempCount++;
    return `t${this.tempCount}`;
  }

  private newLabel(prefix = 'L'): string {
    this.labelCount++;
    return `${prefix}${this.labelCount}`;
  }

  private emit(
    op: string,
    arg1?: string,
    arg2?: string,
    result?: string,
    comment?: string
  ): TACInstruction {
    const instr: TACInstruction = {
      id: this.instructionId++,
      op,
      arg1,
      arg2,
      result,
      comment,
    };
    this.instructions.push(instr);
    return instr;
  }

  private generateStatement(stmt: StatementNode): void {
    switch (stmt.type) {
      case 'VariableDeclaration': {
        const decl = stmt as VariableDeclarationNode;
        if (decl.init) {
          const initPlace = this.generateExpression(decl.init);
          this.emit('=', initPlace, undefined, decl.name, `init variable ${decl.name}`);
        }
        break;
      }

      case 'Assignment': {
        const assign = stmt as AssignmentNode;
        const valPlace = this.generateExpression(assign.value);
        this.emit('=', valPlace, undefined, assign.name, `assign to ${assign.name}`);
        break;
      }

      case 'PrintStatement': {
        const pr = stmt as PrintStatementNode;
        const argPlace = this.generateExpression(pr.argument);
        this.emit('PRINT', argPlace, undefined, undefined, 'print value');
        break;
      }

      case 'IfStatement': {
        const ifs = stmt as IfStatementNode;
        const condPlace = this.generateExpression(ifs.condition);
        const elseLabel = ifs.elseBranch ? this.newLabel('L_ELSE') : this.newLabel('L_ENDIF');
        const endLabel = this.newLabel('L_ENDIF');

        this.emit('IF_FALSE_GOTO', condPlace, undefined, elseLabel, 'jump if condition false');

        // Then branch
        for (const s of ifs.thenBranch) {
          this.generateStatement(s);
        }

        if (ifs.elseBranch && ifs.elseBranch.length > 0) {
          this.emit('GOTO', undefined, undefined, endLabel, 'jump to end of if');
          this.emit('LABEL', undefined, undefined, elseLabel, 'else label');
          for (const s of ifs.elseBranch) {
            this.generateStatement(s);
          }
          this.emit('LABEL', undefined, undefined, endLabel, 'end if label');
        } else {
          this.emit('LABEL', undefined, undefined, elseLabel, 'end if label');
        }
        break;
      }

      case 'WhileStatement': {
        const ws = stmt as WhileStatementNode;
        const startLabel = this.newLabel('L_WHILE_START');
        const endLabel = this.newLabel('L_WHILE_END');

        this.emit('LABEL', undefined, undefined, startLabel, 'loop start');
        const condPlace = this.generateExpression(ws.condition);
        this.emit('IF_FALSE_GOTO', condPlace, undefined, endLabel, 'exit loop if condition false');

        for (const s of ws.body) {
          this.generateStatement(s);
        }

        this.emit('GOTO', undefined, undefined, startLabel, 'loop back');
        this.emit('LABEL', undefined, undefined, endLabel, 'loop exit');
        break;
      }

      case 'BlockStatement': {
        const blk = stmt as BlockStatementNode;
        for (const s of blk.statements) {
          this.generateStatement(s);
        }
        break;
      }
    }
  }

  private generateExpression(expr: ExpressionNode): string {
    switch (expr.type) {
      case 'Literal': {
        const lit = expr as LiteralNode;
        // String literals enclosed in quotes, numbers and booleans as raw
        return lit.valueType === 'string' ? `"${lit.value}"` : `${lit.value}`;
      }

      case 'Identifier': {
        const id = expr as IdentifierNode;
        return id.name;
      }

      case 'UnaryExpression': {
        const un = expr as UnaryExpressionNode;
        const operandPlace = this.generateExpression(un.operand);
        const temp = this.newTemp();
        this.emit(un.operator, operandPlace, undefined, temp, `unary ${un.operator}`);
        return temp;
      }

      case 'BinaryExpression': {
        const bin = expr as BinaryExpressionNode;
        const leftPlace = this.generateExpression(bin.left);
        const rightPlace = this.generateExpression(bin.right);
        const temp = this.newTemp();
        this.emit(bin.operator, leftPlace, rightPlace, temp, `binary ${bin.operator}`);
        return temp;
      }
    }
  }

  public static formatInstruction(instr: TACInstruction): string {
    if (instr.op === 'LABEL') {
      return `${instr.result}:`;
    }
    if (instr.op === 'GOTO') {
      return `goto ${instr.result}`;
    }
    if (instr.op === 'IF_FALSE_GOTO') {
      return `if_false ${instr.arg1} goto ${instr.result}`;
    }
    if (instr.op === 'PRINT') {
      return `print ${instr.arg1}`;
    }
    if (instr.op === '=') {
      return `${instr.result} = ${instr.arg1}`;
    }
    if (['!', '-', '+'].includes(instr.op) && instr.arg2 === undefined) {
      return `${instr.result} = ${instr.op}${instr.arg1}`;
    }
    // Binary operations
    return `${instr.result} = ${instr.arg1} ${instr.op} ${instr.arg2}`;
  }
}
