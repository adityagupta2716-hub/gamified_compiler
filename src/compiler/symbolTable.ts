import { DataType, SymbolEntry } from './types';

export class SymbolScope {
  public name: string;
  public parent: SymbolScope | null = null;
  public symbols: Map<string, SymbolEntry> = new Map();

  constructor(name: string, parent: SymbolScope | null = null) {
    this.name = name;
    this.parent = parent;
  }

  public define(entry: SymbolEntry): boolean {
    if (this.symbols.has(entry.name)) {
      return false; // Already declared in this scope
    }
    this.symbols.set(entry.name, entry);
    return true;
  }

  public resolve(name: string): SymbolEntry | null {
    if (this.symbols.has(name)) {
      return this.symbols.get(name)!;
    }
    if (this.parent) {
      return this.parent.resolve(name);
    }
    return null;
  }

  public updateValue(name: string, value: any): boolean {
    if (this.symbols.has(name)) {
      const s = this.symbols.get(name)!;
      s.value = value;
      s.initialized = true;
      return true;
    }
    if (this.parent) {
      return this.parent.updateValue(name, value);
    }
    return false;
  }
}

export class SymbolTableManager {
  private currentScope: SymbolScope;
  private allEntries: SymbolEntry[] = [];
  private scopeCounter = 0;

  constructor() {
    this.currentScope = new SymbolScope('global');
  }

  public enterScope(prefix = 'block'): string {
    this.scopeCounter++;
    const scopeName = `${prefix}_${this.scopeCounter}`;
    const newScope = new SymbolScope(scopeName, this.currentScope);
    this.currentScope = newScope;
    return scopeName;
  }

  public exitScope(): void {
    if (this.currentScope.parent) {
      this.currentScope = this.currentScope.parent;
    }
  }

  public getCurrentScopeName(): string {
    return this.currentScope.name;
  }

  public define(
    name: string,
    type: DataType,
    line: number,
    column: number,
    value?: any,
    initialized = false
  ): { success: boolean; entry?: SymbolEntry } {
    const entry: SymbolEntry = {
      name,
      type,
      value: value !== undefined ? value : null,
      scope: this.currentScope.name,
      line,
      column,
      initialized,
    };

    const success = this.currentScope.define(entry);
    if (success) {
      this.allEntries.push(entry);
      return { success: true, entry };
    }
    return { success: false };
  }

  public lookup(name: string): SymbolEntry | null {
    return this.currentScope.resolve(name);
  }

  public update(name: string, value: any): boolean {
    const updated = this.currentScope.updateValue(name, value);
    if (updated) {
      const globalRef = this.allEntries.find(
        (e) => e.name === name && e.scope === this.currentScope.name
      );
      if (globalRef) {
        globalRef.value = value;
        globalRef.initialized = true;
      }
    }
    return updated;
  }

  public getAllSymbols(): SymbolEntry[] {
    return [...this.allEntries];
  }
}
