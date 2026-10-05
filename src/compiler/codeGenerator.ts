import { TACInstruction, TargetInstruction } from './types';

export class TargetCodeGenerator {
  private instructions: TargetInstruction[] = [];
  private currentLine = 1;
  private registerMap = new Map<string, string>(); // variable -> register
  private availableRegisters = ['R1', 'R2', 'R3', 'R4'];
  private registerInUse = new Map<string, string>(); // register -> variable/temp

  public generate(tac: TACInstruction[]): TargetInstruction[] {
    this.instructions = [];
    this.currentLine = 1;
    this.registerMap.clear();
    this.registerInUse.clear();

    this.emit('// Educational Target Code (3rd-Year B.Tech Abstract Machine)', []);
    this.emit('// Registers: R1 - R4 | Memory addressing: [var_name]', []);
    this.emit('.CODE', []);

    for (const instr of tac) {
      this.translateInstruction(instr);
    }

    this.emit('HALT', [], 'End of program execution');
    return this.instructions;
  }

  private emit(opcode: string, operands: string[], comment?: string): void {
    this.instructions.push({
      line: this.currentLine++,
      opcode,
      operands,
      comment,
    });
  }

  private allocateRegister(name: string): string {
    if (this.registerMap.has(name)) {
      return this.registerMap.get(name)!;
    }

    // Find first free register
    for (const reg of this.availableRegisters) {
      if (!this.registerInUse.has(reg)) {
        this.registerInUse.set(reg, name);
        this.registerMap.set(name, reg);
        return reg;
      }
    }

    // Fallback: round-robin recycle R1/R2/R3/R4
    const reg = this.availableRegisters[Math.floor(Math.random() * this.availableRegisters.length)];
    const oldVar = this.registerInUse.get(reg);
    if (oldVar) {
      this.emit('STORE', [reg, `[${oldVar}]`], `Spill ${oldVar} to memory`);
      this.registerMap.delete(oldVar);
    }

    this.registerInUse.set(reg, name);
    this.registerMap.set(name, reg);
    return reg;
  }

  private getOperandValue(arg: string, targetReg: string): void {
    if (!isNaN(Number(arg)) || arg === 'true' || arg === 'false') {
      this.emit('LOAD', [targetReg, arg], `Load immediate constant ${arg}`);
    } else if (arg.startsWith('"') && arg.endsWith('"')) {
      this.emit('LOAD_STR', [targetReg, arg], `Load string address`);
    } else {
      // Variable or temp
      if (this.registerMap.has(arg)) {
        const reg = this.registerMap.get(arg)!;
        if (reg !== targetReg) {
          this.emit('MOV', [targetReg, reg], `Copy ${arg} from ${reg}`);
        }
      } else {
        this.emit('LOAD', [targetReg, `[${arg}]`], `Load variable ${arg} from memory`);
      }
    }
  }

  private translateInstruction(instr: TACInstruction): void {
    if (instr.op === 'LABEL') {
      this.emit(`${instr.result}:`, [], 'Branch target label');
      return;
    }

    if (instr.op === 'GOTO') {
      this.emit('JMP', [instr.result!], `Unconditional jump to ${instr.result}`);
      return;
    }

    if (instr.op === 'IF_FALSE_GOTO') {
      const reg = this.allocateRegister('R_COND');
      this.getOperandValue(instr.arg1!, reg);
      this.emit('CMP', [reg, '0'], `Test if ${instr.arg1} is false`);
      this.emit('JEQ', [instr.result!], `Jump to ${instr.result} if false`);
      return;
    }

    if (instr.op === 'PRINT') {
      const reg = 'R1';
      this.getOperandValue(instr.arg1!, reg);
      this.emit('PRINT', [reg], `Output value of ${instr.arg1}`);
      return;
    }

    // Assignment: result = arg1
    if (instr.op === '=' && instr.result && instr.arg1 && !instr.arg2) {
      const reg = this.allocateRegister(instr.result);
      this.getOperandValue(instr.arg1, reg);
      this.emit('STORE', [reg, `[${instr.result}]`], `Save result into variable ${instr.result}`);
      return;
    }

    // Binary arithmetic / comparison: result = arg1 OP arg2
    if (instr.result && instr.arg1 && instr.arg2) {
      const r1 = 'R1';
      const r2 = 'R2';

      this.getOperandValue(instr.arg1, r1);
      this.getOperandValue(instr.arg2, r2);

      switch (instr.op) {
        case '+':
          this.emit('ADD', [r1, r2], `R1 = ${instr.arg1} + ${instr.arg2}`);
          break;
        case '-':
          this.emit('SUB', [r1, r2], `R1 = ${instr.arg1} - ${instr.arg2}`);
          break;
        case '*':
          this.emit('MUL', [r1, r2], `R1 = ${instr.arg1} * ${instr.arg2}`);
          break;
        case '/':
          this.emit('DIV', [r1, r2], `R1 = ${instr.arg1} / ${instr.arg2}`);
          break;
        case '%':
          this.emit('MOD', [r1, r2], `R1 = ${instr.arg1} % ${instr.arg2}`);
          break;
        case '==':
          this.emit('CMP', [r1, r2], 'Compare operands');
          this.emit('SETEQ', [r1], 'Set R1 to 1 if equal, 0 otherwise');
          break;
        case '!=':
          this.emit('CMP', [r1, r2], 'Compare operands');
          this.emit('SETNE', [r1], 'Set R1 to 1 if not equal, 0 otherwise');
          break;
        case '<':
          this.emit('CMP', [r1, r2], 'Compare operands');
          this.emit('SETLT', [r1], 'Set R1 to 1 if less than');
          break;
        case '<=':
          this.emit('CMP', [r1, r2], 'Compare operands');
          this.emit('SETLE', [r1], 'Set R1 to 1 if less than or equal');
          break;
        case '>':
          this.emit('CMP', [r1, r2], 'Compare operands');
          this.emit('SETGT', [r1], 'Set R1 to 1 if greater than');
          break;
        case '>=':
          this.emit('CMP', [r1, r2], 'Compare operands');
          this.emit('SETGE', [r1], 'Set R1 to 1 if greater than or equal');
          break;
        default:
          this.emit('OP', [instr.op, r1, r2]);
      }

      this.emit('STORE', [r1, `[${instr.result}]`], `Store computed value in ${instr.result}`);
      return;
    }
  }

  public static formatAssembly(instructions: TargetInstruction[]): string {
    return instructions
      .map((instr) => {
        if (instr.opcode.startsWith('//') || instr.opcode.startsWith('.')) {
          return instr.opcode;
        }
        if (instr.opcode.endsWith(':')) {
          return instr.opcode;
        }
        const opStr = `${instr.opcode.padEnd(8)} ${instr.operands.join(', ')}`;
        return instr.comment ? `${opStr.padEnd(30)} ; ${instr.comment}` : opStr;
      })
      .join('\n');
  }
}
