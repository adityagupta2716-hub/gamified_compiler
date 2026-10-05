import { TACInstruction, OptimizationPassStats } from './types';

export interface OptimizerResult {
  optimizedTac: TACInstruction[];
  stats: OptimizationPassStats;
  diffLog: Array<{
    type: 'modified' | 'removed' | 'added' | 'unchanged';
    original?: TACInstruction;
    optimized?: TACInstruction;
    description?: string;
  }>;
}

export class CodeOptimizer {
  public optimize(instructions: TACInstruction[]): OptimizerResult {
    const originalCount = instructions.length;
    let currentTac: TACInstruction[] = JSON.parse(JSON.stringify(instructions));
    const notes: string[] = [];

    let constantFoldingCount = 0;
    let constantPropagationCount = 0;
    let algebraicSimplificationCount = 0;
    let deadCodeCount = 0;

    let changed = true;
    let iteration = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (changed && iteration < maxIterations) {
      changed = false;
      iteration++;

      // 1. Constant Folding
      const foldResult = this.passConstantFolding(currentTac);
      if (foldResult.changed) {
        currentTac = foldResult.instructions;
        constantFoldingCount += foldResult.count;
        notes.push(...foldResult.notes);
        changed = true;
      }

      // 2. Algebraic Simplification
      const algResult = this.passAlgebraicSimplification(currentTac);
      if (algResult.changed) {
        currentTac = algResult.instructions;
        algebraicSimplificationCount += algResult.count;
        notes.push(...algResult.notes);
        changed = true;
      }

      // 3. Constant Propagation
      const propResult = this.passConstantPropagation(currentTac);
      if (propResult.changed) {
        currentTac = propResult.instructions;
        constantPropagationCount += propResult.count;
        notes.push(...propResult.notes);
        changed = true;
      }

      // 4. Dead Code Elimination
      const dceResult = this.passDeadCodeElimination(currentTac);
      if (dceResult.changed) {
        currentTac = dceResult.instructions;
        deadCodeCount += dceResult.count;
        notes.push(...dceResult.notes);
        changed = true;
      }
    }

    const finalCount = currentTac.length;
    const reductionPercentage =
      originalCount > 0 ? Math.max(0, Math.round(((originalCount - finalCount) / originalCount) * 100)) : 0;

    // Build diff log
    const diffLog = this.generateDiff(instructions, currentTac);

    return {
      optimizedTac: currentTac,
      stats: {
        constantFoldingCount,
        constantPropagationCount,
        algebraicSimplificationCount,
        deadCodeCount,
        initialInstructions: originalCount,
        optimizedInstructions: finalCount,
        reductionPercentage,
        notes,
      },
      diffLog,
    };
  }

  private isConstant(val?: string): boolean {
    if (!val) return false;
    // Check number (int or float) or boolean or string
    return (
      !isNaN(Number(val)) ||
      val === 'true' ||
      val === 'false' ||
      (val.startsWith('"') && val.endsWith('"'))
    );
  }

  private parseConstant(val: string): any {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1);
    const n = Number(val);
    return isNaN(n) ? val : n;
  }

  private formatConstant(val: any): string {
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
  }

  // Pass 1: Constant Folding
  private passConstantFolding(tac: TACInstruction[]): {
    instructions: TACInstruction[];
    changed: boolean;
    count: number;
    notes: string[];
  } {
    let changed = false;
    let count = 0;
    const notes: string[] = [];
    const newTac: TACInstruction[] = [];

    for (const instr of tac) {
      if (
        instr.arg1 &&
        instr.arg2 &&
        instr.result &&
        this.isConstant(instr.arg1) &&
        this.isConstant(instr.arg2)
      ) {
        const c1 = this.parseConstant(instr.arg1);
        const c2 = this.parseConstant(instr.arg2);
        let folded: any = null;
        let validFold = true;

        switch (instr.op) {
          case '+':
            folded = c1 + c2;
            break;
          case '-':
            folded = c1 - c2;
            break;
          case '*':
            folded = c1 * c2;
            break;
          case '/':
            if (c2 !== 0) {
              folded = typeof c1 === 'number' && typeof c2 === 'number' && Number.isInteger(c1) && Number.isInteger(c2)
                ? Math.floor(c1 / c2)
                : c1 / c2;
            } else {
              validFold = false;
            }
            break;
          case '%':
            if (c2 !== 0) folded = c1 % c2;
            else validFold = false;
            break;
          case '==':
            folded = c1 === c2;
            break;
          case '!=':
            folded = c1 !== c2;
            break;
          case '<':
            folded = c1 < c2;
            break;
          case '<=':
            folded = c1 <= c2;
            break;
          case '>':
            folded = c1 > c2;
            break;
          case '>=':
            folded = c1 >= c2;
            break;
          case '&&':
            folded = Boolean(c1 && c2);
            break;
          case '||':
            folded = Boolean(c1 || c2);
            break;
          default:
            validFold = false;
        }

        if (validFold && folded !== null) {
          changed = true;
          count++;
          const formattedVal = this.formatConstant(folded);
          notes.push(`Constant Folding: ${instr.arg1} ${instr.op} ${instr.arg2} -> ${formattedVal}`);
          newTac.push({
            id: instr.id,
            op: '=',
            arg1: formattedVal,
            result: instr.result,
            comment: `folded: ${instr.arg1} ${instr.op} ${instr.arg2}`,
          });
          continue;
        }
      }

      newTac.push(instr);
    }

    return { instructions: newTac, changed, count, notes };
  }

  // Pass 2: Algebraic Simplification
  private passAlgebraicSimplification(tac: TACInstruction[]): {
    instructions: TACInstruction[];
    changed: boolean;
    count: number;
    notes: string[];
  } {
    let changed = false;
    let count = 0;
    const notes: string[] = [];
    const newTac: TACInstruction[] = [];

    for (const instr of tac) {
      if (instr.arg1 && instr.arg2 && instr.result) {
        const a1 = instr.arg1;
        const a2 = instr.arg2;

        // x + 0 -> x
        if (instr.op === '+' && a2 === '0') {
          changed = true;
          count++;
          notes.push(`Algebraic Simplification: ${a1} + 0 -> ${a1}`);
          newTac.push({ id: instr.id, op: '=', arg1: a1, result: instr.result, comment: 'simplified + 0' });
          continue;
        }
        // 0 + x -> x
        if (instr.op === '+' && a1 === '0') {
          changed = true;
          count++;
          notes.push(`Algebraic Simplification: 0 + ${a2} -> ${a2}`);
          newTac.push({ id: instr.id, op: '=', arg1: a2, result: instr.result, comment: 'simplified 0 +' });
          continue;
        }
        // x - 0 -> x
        if (instr.op === '-' && a2 === '0') {
          changed = true;
          count++;
          notes.push(`Algebraic Simplification: ${a1} - 0 -> ${a1}`);
          newTac.push({ id: instr.id, op: '=', arg1: a1, result: instr.result, comment: 'simplified - 0' });
          continue;
        }
        // x * 1 -> x
        if (instr.op === '*' && a2 === '1') {
          changed = true;
          count++;
          notes.push(`Algebraic Simplification: ${a1} * 1 -> ${a1}`);
          newTac.push({ id: instr.id, op: '=', arg1: a1, result: instr.result, comment: 'simplified * 1' });
          continue;
        }
        // 1 * x -> x
        if (instr.op === '*' && a1 === '1') {
          changed = true;
          count++;
          notes.push(`Algebraic Simplification: 1 * ${a2} -> ${a2}`);
          newTac.push({ id: instr.id, op: '=', arg1: a2, result: instr.result, comment: 'simplified 1 *' });
          continue;
        }
        // x * 0 -> 0 or 0 * x -> 0
        if (instr.op === '*' && (a1 === '0' || a2 === '0')) {
          changed = true;
          count++;
          notes.push(`Algebraic Simplification: ${a1} * ${a2} -> 0`);
          newTac.push({ id: instr.id, op: '=', arg1: '0', result: instr.result, comment: 'simplified * 0' });
          continue;
        }
        // x / 1 -> x
        if (instr.op === '/' && a2 === '1') {
          changed = true;
          count++;
          notes.push(`Algebraic Simplification: ${a1} / 1 -> ${a1}`);
          newTac.push({ id: instr.id, op: '=', arg1: a1, result: instr.result, comment: 'simplified / 1' });
          continue;
        }
      }

      newTac.push(instr);
    }

    return { instructions: newTac, changed, count, notes };
  }

  // Pass 3: Constant Propagation (within basic blocks)
  private passConstantPropagation(tac: TACInstruction[]): {
    instructions: TACInstruction[];
    changed: boolean;
    count: number;
    notes: string[];
  } {
    let changed = false;
    let count = 0;
    const notes: string[] = [];
    const newTac: TACInstruction[] = [];
    const constMap = new Map<string, string>();

    for (const instr of tac) {
      // Clear mappings at labels or branches to maintain sound basic block boundaries
      if (instr.op === 'LABEL' || instr.op === 'GOTO' || instr.op === 'IF_FALSE_GOTO') {
        constMap.clear();
        newTac.push(instr);
        continue;
      }

      let updatedArg1 = instr.arg1;
      let updatedArg2 = instr.arg2;

      if (instr.arg1 && constMap.has(instr.arg1)) {
        updatedArg1 = constMap.get(instr.arg1)!;
        changed = true;
        count++;
        notes.push(`Constant Propagation: Replaced '${instr.arg1}' with '${updatedArg1}'`);
      }

      if (instr.arg2 && constMap.has(instr.arg2)) {
        updatedArg2 = constMap.get(instr.arg2)!;
        changed = true;
        count++;
        notes.push(`Constant Propagation: Replaced '${instr.arg2}' with '${updatedArg2}'`);
      }

      const updatedInstr: TACInstruction = {
        ...instr,
        arg1: updatedArg1,
        arg2: updatedArg2,
      };

      // If this instruction defines a constant, record it in our map
      if (updatedInstr.op === '=' && updatedInstr.result && this.isConstant(updatedInstr.arg1)) {
        constMap.set(updatedInstr.result, updatedInstr.arg1!);
      } else if (updatedInstr.result) {
        // If variable is reassigned a non-constant, remove it from map
        constMap.delete(updatedInstr.result);
      }

      newTac.push(updatedInstr);
    }

    return { instructions: newTac, changed, count, notes };
  }

  // Pass 4: Dead Code Elimination
  private passDeadCodeElimination(tac: TACInstruction[]): {
    instructions: TACInstruction[];
    changed: boolean;
    count: number;
    notes: string[];
  } {
    let changed = false;
    let count = 0;
    const notes: string[] = [];

    // Count uses of each temporary (t1, t2, ...)
    const usageCount = new Map<string, number>();

    for (const instr of tac) {
      if (instr.arg1) {
        usageCount.set(instr.arg1, (usageCount.get(instr.arg1) || 0) + 1);
      }
      if (instr.arg2) {
        usageCount.set(instr.arg2, (usageCount.get(instr.arg2) || 0) + 1);
      }
    }

    const newTac: TACInstruction[] = [];

    for (const instr of tac) {
      // If temporary variable is created but never used, eliminate it
      if (
        instr.result &&
        instr.result.startsWith('t') &&
        !isNaN(Number(instr.result.substring(1))) &&
        (usageCount.get(instr.result) || 0) === 0
      ) {
        changed = true;
        count++;
        notes.push(`Dead Code Elimination: Removed unused temporary variable '${instr.result}'`);
        continue;
      }

      newTac.push(instr);
    }

    return { instructions: newTac, changed, count, notes };
  }

  private generateDiff(
    original: TACInstruction[],
    optimized: TACInstruction[]
  ): Array<{
    type: 'modified' | 'removed' | 'added' | 'unchanged';
    original?: TACInstruction;
    optimized?: TACInstruction;
    description?: string;
  }> {
    const diff: Array<{
      type: 'modified' | 'removed' | 'added' | 'unchanged';
      original?: TACInstruction;
      optimized?: TACInstruction;
      description?: string;
    }> = [];

    const optMap = new Map<number, TACInstruction>();
    for (const o of optimized) {
      optMap.set(o.id, o);
    }

    for (const orig of original) {
      if (optMap.has(orig.id)) {
        const opt = optMap.get(orig.id)!;
        const isIdentical =
          orig.op === opt.op && orig.arg1 === opt.arg1 && orig.arg2 === opt.arg2 && orig.result === opt.result;

        if (isIdentical) {
          diff.push({ type: 'unchanged', original: orig, optimized: opt });
        } else {
          diff.push({
            type: 'modified',
            original: orig,
            optimized: opt,
            description: `Transformed to ${opt.result || ''} = ${opt.arg1 || ''}`,
          });
        }
      } else {
        diff.push({
          type: 'removed',
          original: orig,
          description: 'Eliminated as dead code or folded',
        });
      }
    }

    return diff;
  }
}
