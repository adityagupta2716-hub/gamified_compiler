import {
  DataType,
  ExpressionNode,
  ProgramNode,
  StatementNode,
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
  BaseASTNode,
} from './types';

export function createProgram(statements: StatementNode[], line = 1, col = 1): ProgramNode {
  return {
    type: 'Program',
    statements,
    line,
    column: col,
  };
}

export function createVarDecl(
  varType: DataType,
  name: string,
  init?: ExpressionNode,
  line = 1,
  col = 1
): VariableDeclarationNode {
  return {
    type: 'VariableDeclaration',
    varType,
    name,
    init,
    line,
    column: col,
  };
}

export function createAssignment(
  name: string,
  value: ExpressionNode,
  line = 1,
  col = 1
): AssignmentNode {
  return {
    type: 'Assignment',
    name,
    value,
    line,
    column: col,
  };
}

export function createBinaryExpr(
  left: ExpressionNode,
  operator: string,
  right: ExpressionNode,
  line = 1,
  col = 1
): BinaryExpressionNode {
  return {
    type: 'BinaryExpression',
    operator,
    left,
    right,
    line,
    column: col,
  };
}

export function createUnaryExpr(
  operator: string,
  operand: ExpressionNode,
  line = 1,
  col = 1
): UnaryExpressionNode {
  return {
    type: 'UnaryExpression',
    operator,
    operand,
    line,
    column: col,
  };
}

export function createLiteral(
  valueType: DataType,
  value: any,
  raw: string,
  line = 1,
  col = 1
): LiteralNode {
  return {
    type: 'Literal',
    valueType,
    value,
    raw,
    line,
    column: col,
  };
}

export function createIdentifier(name: string, line = 1, col = 1): IdentifierNode {
  return {
    type: 'Identifier',
    name,
    line,
    column: col,
  };
}

export function createPrint(argument: ExpressionNode, line = 1, col = 1): PrintStatementNode {
  return {
    type: 'PrintStatement',
    argument,
    line,
    column: col,
  };
}

export function createIf(
  condition: ExpressionNode,
  thenBranch: StatementNode[],
  elseBranch?: StatementNode[],
  line = 1,
  col = 1
): IfStatementNode {
  return {
    type: 'IfStatement',
    condition,
    thenBranch,
    elseBranch,
    line,
    column: col,
  };
}

export function createWhile(
  condition: ExpressionNode,
  body: StatementNode[],
  line = 1,
  col = 1
): WhileStatementNode {
  return {
    type: 'WhileStatement',
    condition,
    body,
    line,
    column: col,
  };
}

export function createBlock(statements: StatementNode[], line = 1, col = 1): BlockStatementNode {
  return {
    type: 'BlockStatement',
    statements,
    line,
    column: col,
  };
}

// Tree structure interface for visualizer
export interface VisualASTNode {
  id: string;
  name: string;
  type: string;
  detail?: string;
  category: 'program' | 'declaration' | 'assignment' | 'control' | 'expression' | 'literal' | 'identifier';
  children: VisualASTNode[];
  line: number;
  column: number;
}

export function convertToVisualAST(node: BaseASTNode, parentId = 'root', index = 0): VisualASTNode {
  const currentId = `${parentId}_${node.type}_${index}`;

  switch (node.type) {
    case 'Program': {
      const p = node as ProgramNode;
      return {
        id: currentId,
        name: 'Program',
        type: 'Program',
        detail: `${p.statements.length} statements`,
        category: 'program',
        children: p.statements.map((stmt, i) => convertToVisualAST(stmt, currentId, i)),
        line: p.line,
        column: p.column,
      };
    }
    case 'VariableDeclaration': {
      const v = node as VariableDeclarationNode;
      const children: VisualASTNode[] = [
        {
          id: `${currentId}_type`,
          name: `Type: ${v.varType}`,
          type: 'TypeSpecifier',
          category: 'declaration',
          children: [],
          line: v.line,
          column: v.column,
        },
        {
          id: `${currentId}_id`,
          name: `Identifier: ${v.name}`,
          type: 'Identifier',
          category: 'identifier',
          children: [],
          line: v.line,
          column: v.column,
        },
      ];
      if (v.init) {
        children.push(convertToVisualAST(v.init, currentId, 2));
      }
      return {
        id: currentId,
        name: `VarDecl (${v.name})`,
        type: 'VariableDeclaration',
        detail: `${v.varType} ${v.name}`,
        category: 'declaration',
        children,
        line: v.line,
        column: v.column,
      };
    }
    case 'Assignment': {
      const a = node as AssignmentNode;
      return {
        id: currentId,
        name: `Assign (${a.name})`,
        type: 'Assignment',
        detail: `${a.name} = ...`,
        category: 'assignment',
        children: [
          {
            id: `${currentId}_id`,
            name: `Target: ${a.name}`,
            type: 'Identifier',
            category: 'identifier',
            children: [],
            line: a.line,
            column: a.column,
          },
          convertToVisualAST(a.value, currentId, 1),
        ],
        line: a.line,
        column: a.column,
      };
    }
    case 'BinaryExpression': {
      const b = node as BinaryExpressionNode;
      return {
        id: currentId,
        name: `BinaryExpr (${b.operator})`,
        type: 'BinaryExpression',
        detail: `Operator: ${b.operator}`,
        category: 'expression',
        children: [
          convertToVisualAST(b.left, currentId, 0),
          convertToVisualAST(b.right, currentId, 1),
        ],
        line: b.line,
        column: b.column,
      };
    }
    case 'UnaryExpression': {
      const u = node as UnaryExpressionNode;
      return {
        id: currentId,
        name: `UnaryExpr (${u.operator})`,
        type: 'UnaryExpression',
        detail: `Operator: ${u.operator}`,
        category: 'expression',
        children: [convertToVisualAST(u.operand, currentId, 0)],
        line: u.line,
        column: u.column,
      };
    }
    case 'Literal': {
      const l = node as LiteralNode;
      return {
        id: currentId,
        name: `Literal: ${l.raw}`,
        type: 'Literal',
        detail: `Type: ${l.valueType}`,
        category: 'literal',
        children: [],
        line: l.line,
        column: l.column,
      };
    }
    case 'Identifier': {
      const id = node as IdentifierNode;
      return {
        id: currentId,
        name: `Identifier: ${id.name}`,
        type: 'Identifier',
        category: 'identifier',
        children: [],
        line: id.line,
        column: id.column,
      };
    }
    case 'PrintStatement': {
      const pr = node as PrintStatementNode;
      return {
        id: currentId,
        name: 'Print',
        type: 'PrintStatement',
        detail: 'print(...)',
        category: 'control',
        children: [convertToVisualAST(pr.argument, currentId, 0)],
        line: pr.line,
        column: pr.column,
      };
    }
    case 'IfStatement': {
      const ifs = node as IfStatementNode;
      const children: VisualASTNode[] = [
        convertToVisualAST(ifs.condition, `${currentId}_cond`, 0),
        {
          id: `${currentId}_then`,
          name: 'Then Block',
          type: 'Block',
          category: 'control',
          children: ifs.thenBranch.map((s, i) => convertToVisualAST(s, `${currentId}_then`, i)),
          line: ifs.line,
          column: ifs.column,
        },
      ];
      if (ifs.elseBranch && ifs.elseBranch.length > 0) {
        children.push({
          id: `${currentId}_else`,
          name: 'Else Block',
          type: 'Block',
          category: 'control',
          children: ifs.elseBranch.map((s, i) => convertToVisualAST(s, `${currentId}_else`, i)),
          line: ifs.line,
          column: ifs.column,
        });
      }
      return {
        id: currentId,
        name: 'If Statement',
        type: 'IfStatement',
        category: 'control',
        children,
        line: ifs.line,
        column: ifs.column,
      };
    }
    case 'WhileStatement': {
      const ws = node as WhileStatementNode;
      return {
        id: currentId,
        name: 'While Loop',
        type: 'WhileStatement',
        category: 'control',
        children: [
          convertToVisualAST(ws.condition, `${currentId}_cond`, 0),
          {
            id: `${currentId}_body`,
            name: 'Loop Body',
            type: 'Block',
            category: 'control',
            children: ws.body.map((s, i) => convertToVisualAST(s, `${currentId}_body`, i)),
            line: ws.line,
            column: ws.column,
          },
        ],
        line: ws.line,
        column: ws.column,
      };
    }
    case 'BlockStatement': {
      const blk = node as BlockStatementNode;
      return {
        id: currentId,
        name: 'Block',
        type: 'BlockStatement',
        category: 'control',
        children: blk.statements.map((s, i) => convertToVisualAST(s, currentId, i)),
        line: blk.line,
        column: blk.column,
      };
    }
    default:
      return {
        id: currentId,
        name: (node as any).type || 'UnknownNode',
        type: 'Unknown',
        category: 'expression',
        children: [],
        line: node.line,
        column: node.column,
      };
  }
}
