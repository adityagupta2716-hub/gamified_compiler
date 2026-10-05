import React, { useState, useMemo } from 'react';
import { ProgramNode } from '../../compiler/types';
import { convertToVisualAST, VisualASTNode } from '../../compiler/ast';
import { Network, Code, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ASTVisualizerProps {
  ast: ProgramNode | null;
}

interface LayoutNode {
  data: VisualASTNode;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutLink {
  source: LayoutNode;
  target: LayoutNode;
}

export const ASTVisualizer: React.FC<ASTVisualizerProps> = ({ ast }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
  const [selectedNode, setSelectedNode] = useState<VisualASTNode | null>(null);
  const [scale, setScale] = useState(1);

  const visualTree = useMemo(() => {
    if (!ast) return null;
    return convertToVisualAST(ast);
  }, [ast]);

  // Compute hierarchical tree layout
  const { nodes, links, bounds } = useMemo(() => {
    if (!visualTree) {
      return { nodes: [], links: [], bounds: { minX: 0, maxX: 600, minY: 0, maxY: 400 } };
    }

    const NODE_WIDTH = 130;
    const NODE_HEIGHT = 44;
    const HORIZONTAL_GAP = 30;
    const VERTICAL_GAP = 70;

    const layoutNodes: LayoutNode[] = [];
    const layoutLinks: LayoutLink[] = [];

    // First pass: calculate subtree widths
    function calculateSubtreeWidth(node: VisualASTNode): number {
      if (!node.children || node.children.length === 0) {
        return NODE_WIDTH;
      }
      let totalWidth = 0;
      for (const child of node.children) {
        totalWidth += calculateSubtreeWidth(child) + HORIZONTAL_GAP;
      }
      return Math.max(NODE_WIDTH, totalWidth - HORIZONTAL_GAP);
    }

    // Second pass: position nodes recursively
    function positionSubtree(node: VisualASTNode, x: number, y: number, parentLayout?: LayoutNode) {
      const currentLayout: LayoutNode = {
        data: node,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      };
      layoutNodes.push(currentLayout);

      if (parentLayout) {
        layoutLinks.push({ source: parentLayout, target: currentLayout });
      }

      if (node.children && node.children.length > 0) {
        const subtreeWidth = calculateSubtreeWidth(node);
        let startX = x - subtreeWidth / 2;

        for (const child of node.children) {
          const childWidth = calculateSubtreeWidth(child);
          const childX = startX + childWidth / 2;
          positionSubtree(child, childX, y + VERTICAL_GAP + NODE_HEIGHT, currentLayout);
          startX += childWidth + HORIZONTAL_GAP;
        }
      }
    }

    positionSubtree(visualTree, 450, 40);

    // Compute bounding box
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const n of layoutNodes) {
      minX = Math.min(minX, n.x - n.width / 2);
      maxX = Math.max(maxX, n.x + n.width / 2);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + n.height);
    }

    return {
      nodes: layoutNodes,
      links: layoutLinks,
      bounds: {
        minX: Math.min(0, minX - 40),
        maxX: Math.max(900, maxX + 40),
        minY: Math.min(0, minY - 20),
        maxY: Math.max(500, maxY + 60),
      },
    };
  }, [visualTree]);

  if (!ast) {
    return (
      <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-500 text-xs">
        <Network className="h-8 w-8 text-slate-600 mb-2" />
        <p>No Abstract Syntax Tree available.</p>
        <p className="text-[11px] text-slate-600 mt-1">Compile valid syntax to construct the AST.</p>
      </div>
    );
  }

  const getNodeColor = (cat: string) => {
    switch (cat) {
      case 'program':
        return 'from-purple-900/80 to-indigo-950/80 border-purple-500/50 text-purple-200';
      case 'declaration':
        return 'from-cyan-900/80 to-blue-950/80 border-cyan-500/50 text-cyan-200';
      case 'assignment':
        return 'from-emerald-900/80 to-teal-950/80 border-emerald-500/50 text-emerald-200';
      case 'control':
        return 'from-amber-900/80 to-orange-950/80 border-amber-500/50 text-amber-200';
      case 'expression':
        return 'from-pink-900/80 to-rose-950/80 border-pink-500/50 text-pink-200';
      case 'literal':
        return 'from-sky-900/80 to-slate-900/80 border-sky-400/50 text-sky-200';
      case 'identifier':
        return 'from-violet-900/80 to-slate-900/80 border-violet-400/50 text-violet-200';
      default:
        return 'from-slate-900 to-slate-950 border-slate-700 text-slate-200';
    }
  };

  const svgWidth = Math.max(900, bounds.maxX - bounds.minX);
  const svgHeight = Math.max(500, bounds.maxY - bounds.minY);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === 'visual'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Interactive Tree</span>
          </button>

          <button
            onClick={() => setViewMode('json')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === 'json'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>AST JSON</span>
          </button>
        </div>

        {/* Zoom Controls (when visual) */}
        {viewMode === 'visual' && (
          <div className="flex items-center space-x-1.5 bg-slate-900/80 rounded-lg border border-slate-800 p-1 text-slate-400">
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.15))}
              className="p-1 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(1.8, s + 0.15))}
              className="p-1 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setScale(1)}
              className="p-1 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative overflow-auto rounded-xl border border-slate-800/90 bg-[#060914] shadow-inner min-h-[380px]">
        {viewMode === 'visual' ? (
          <div
            className="w-full h-full min-w-full min-h-[480px] p-6 transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`${bounds.minX} ${bounds.minY} ${svgWidth} ${svgHeight}`}
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="linkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Connecting Bezier Splines */}
              {links.map((link, idx) => {
                const sx = link.source.x;
                const sy = link.source.y + link.source.height;
                const tx = link.target.x;
                const ty = link.target.y;
                const midY = (sy + ty) / 2;
                const path = `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;

                return (
                  <path
                    key={idx}
                    d={path}
                    fill="none"
                    stroke="url(#linkGradient)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="opacity-70"
                  />
                );
              })}

              {/* Render Tree Nodes as interactive SVG foreignObjects */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.data.id;
                const left = node.x - node.width / 2;
                const top = node.y;

                return (
                  <foreignObject
                    key={node.data.id}
                    x={left}
                    y={top}
                    width={node.width}
                    height={node.height}
                    className="overflow-visible cursor-pointer"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedNode(node.data)}
                      className={`flex flex-col justify-center items-center h-full rounded-xl border bg-gradient-to-b px-2 py-1 shadow-md transition-all hover:scale-105 ${getNodeColor(
                        node.data.category
                      )} ${isSelected ? 'ring-2 ring-cyan-400 shadow-cyan-500/50' : ''}`}
                    >
                      <span className="text-[11px] font-bold truncate max-w-full text-center">
                        {node.data.name}
                      </span>
                      {node.data.detail && (
                        <span className="text-[9px] opacity-75 font-mono truncate max-w-full">
                          {node.data.detail}
                        </span>
                      )}
                    </motion.div>
                  </foreignObject>
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="p-4">
            <pre className="font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
              {JSON.stringify(ast, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-3 shadow-md flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center space-x-2">
                <span>{selectedNode.name}</span>
                <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {selectedNode.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Category: <span className="capitalize text-slate-300">{selectedNode.category}</span> | Line {selectedNode.line}, Col {selectedNode.column}
                {selectedNode.detail ? ` | ${selectedNode.detail}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
