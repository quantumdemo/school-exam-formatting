import { parseObjectives, parseTheory } from '../src/parser.js';

function assert(condition, message) {
    if (!condition) {
        console.error('FAILED:', message);
        process.exit(1);
    }
    console.log('PASSED:', message);
}

// Test Objective Parsing
const objText = `1. What is 2+2?
A. 3 B. 4 C. 5 D. 6
2. (A) Apple (B) Banana (C) Cherry`;

const objectives = parseObjectives(objText);
assert(objectives.length === 2, 'Should parse 2 objectives');
assert(objectives[0].number === '1', 'First objective should be number 1');
assert(objectives[0].options.length === 4, 'First objective should have 4 options');
assert(objectives[0].options[1].label === 'B', 'Option B label should match');
assert(objectives[0].options[1].text === '4', 'Option B text should be 4');
assert(objectives[1].options.length === 3, 'Second objective should have 3 options');

// Test Theory Parsing
const theoryText = `1. (a) Define Physics [2 marks]
(b) Explain motion. [5m]
2. What is a force? [10 marks]`;

const theory = parseTheory(theoryText);
assert(theory.length === 2, 'Should parse 2 theory questions');
// assert(theory[0].numberWord === 'One', 'First question should be "One"'); // Removed from parser
assert(theory[0].subQuestions.length === 2, 'First question should have 2 sub-questions');
assert(theory[0].subQuestions[0].label === 'a', 'Sub-question (a) label');
assert(theory[0].subQuestions[0].marks === '2 marks', 'Sub-question (a) marks');
assert(theory[1].marks === '10 marks', 'Second question should have marks');

console.log('All parser tests passed!');
