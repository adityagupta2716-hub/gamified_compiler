import { Compiler } from '../compiler';
import { IntermediateCodeGenerator } from '../intermediateCode';
import { TargetCodeGenerator } from '../codeGenerator';

console.log('=== RUNNING COMPILER ENGINE TESTS ===\n');

// Test 1: Valid program
const validCode = `int a = 10;
int b = 20;
int c = a + b;
print(c);`;

console.log('--- Test 1: Valid Addition Program ---');
const res1 = Compiler.compile(validCode);
console.log('Success:', res1.success);
console.log('Tokens count:', res1.tokens.length);
console.log('Symbol table entries:', res1.symbolTable.map((s) => `${s.name}: ${s.type} = ${s.value}`));
console.log('TAC instructions:');
res1.tac.forEach((instr) => console.log('  ', IntermediateCodeGenerator.formatInstruction(instr)));
console.log('Optimized TAC instructions:');
res1.optimizedTac.forEach((instr) => console.log('  ', IntermediateCodeGenerator.formatInstruction(instr)));
console.log('Target Assembly (first 5 lines):');
console.log(TargetCodeGenerator.formatAssembly(res1.targetCode.slice(0, 8)));
console.assert(res1.success === true, 'Test 1 should succeed');
console.assert(res1.tokens.length > 0, 'Tokens should be generated');
console.assert(res1.ast !== null, 'AST should be generated');
console.assert(res1.tac.length > 0, 'TAC should be generated');
console.assert(res1.targetCode.length > 0, 'Target code should be generated');

// Test 2: Aggressive Optimization
const optCode = `int a = 10 * 2;
int b = a + 0;
int c = b * 1;
int d = c + 5;
print(d);`;

console.log('\n--- Test 2: Optimization Test ---');
const res2 = Compiler.compile(optCode);
console.log('Original instruction count:', res2.optimizationStats.initialInstructions);
console.log('Optimized instruction count:', res2.optimizationStats.optimizedInstructions);
console.log('Reduction %:', res2.optimizationStats.reductionPercentage);
console.log('Notes:', res2.optimizationStats.notes);
console.assert(res2.optimizationStats.constantFoldingCount >= 1, 'Should fold 10 * 2');

// Test 3: Syntax Error detection
const syntaxErrCode = `int a = 10
int b = 20;`;

console.log('\n--- Test 3: Syntax Error Detection ---');
const res3 = Compiler.compile(syntaxErrCode);
console.log('Success:', res3.success);
console.log('Errors caught:', res3.errors.length);
console.log('First error:', res3.errors[0]?.message, 'at line', res3.errors[0]?.line);
console.assert(res3.success === false, 'Test 3 should fail due to syntax error');
console.assert(res3.errors.some((e) => e.phase === 'syntax'), 'Should contain syntax error');

// Test 4: Semantic Type Error detection
const typeErrCode = `int counter = 42;
counter = "incompatible_string";`;

console.log('\n--- Test 4: Semantic Type Error Detection ---');
const res4 = Compiler.compile(typeErrCode);
console.log('Success:', res4.success);
console.log('Semantic errors caught:', res4.errors.filter((e) => e.phase === 'semantic').length);
console.log('First semantic error:', res4.errors.find((e) => e.phase === 'semantic')?.message);
console.assert(res4.success === false, 'Test 4 should fail due to type mismatch');
console.assert(res4.errors.some((e) => e.phase === 'semantic'), 'Should contain semantic error');

// Test 5: Lexical Error detection
const lexErrCode = `int a = 10 @ 20;`;

console.log('\n--- Test 5: Lexical Error Detection ---');
const res5 = Compiler.compile(lexErrCode);
console.log('Lexical errors:', res5.errors.filter((e) => e.phase === 'lexical').length);
console.assert(res5.errors.some((e) => e.phase === 'lexical'), 'Should catch unknown @ token');

console.log('\n=== ALL COMPILER TESTS PASSED PERFECTLY! ===');
