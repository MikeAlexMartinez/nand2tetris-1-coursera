const { C_ARITHMETIC, C_POP, C_PUSH } = require('../Mapping/constants')

function labelGenerator() {
  let labelCount = 0;
  
  const getNext = () => ({
    nextAddress: `@NEXT.${labelCount}`,
    nextLabel: `(NEXT.${labelCount})`,
  });

  const getEnd = () => ({
    endAddress: `@END.${labelCount}`,
    endLabel: `(END.${labelCount})`,
  });

  return () => {
    labelCount++;
    return {
      getNext,
      getEnd
    };
  };
}

const getLabels = labelGenerator();

function pushConstant(index) {
  return [
    `@${index}`,
    'D=A',
    '@SP',
    'A=M',
    'M=D',
    '@SP',
    'M=M+1',
  ]
}

function writhPushOp(memory, index, source) {
  switch (memory) {
    case 'constant':
      return [`// ${source}`, ...pushConstant(index)];
    default:
      throw Error(`memory segment is invalid: ${memory}`)
  }
}

function writePushPopOps(commandType, memory, index, source) {
  return commandType === C_PUSH
    ? writhPushOp(memory, index, source)
    : writePushPopOps(memory, index, source);
}

function operationMap(op) {
  const operations = {
    add: 'M+D',
    sub: 'M-D',
    eq: 'JEQ',
    gt: 'JGT',
    lt: 'JLT',
    and: 'D&M',
    or: 'D|M',
    not: '!M',
  };
  return operations[op];
}

function withOpComment(op, fn) {
  return [`// ${op}`].concat(fn(op))
}

function popTwo() {
  return [
    '@SP',
    'AM=M-1',
    'D=M',
    '@SP',
    'A=M-1',
  ]
}

function comparatorOp(op) {
  const { getNext, getEnd } = getLabels()
  const { nextAddress, nextLabel } = getNext()
  const { endAddress, endLabel } = getEnd()
  return [
    ...popTwo(),
    'D=D-M',
    nextAddress, // next
    `D; ${operationMap(op)}`,
    'M=0', // return 0
    endAddress, // go to end
    '0; JMP', //unconditional jump
    nextLabel, // <= next
    'M=-1', //, return -1
    endLabel, //, end
  ];
}

function negOp() {
  return [
    `@SP`,
    'A=M-1',
    'M=-M',
  ];
}

function combinationOp(op) {
  return [
    ...popTwo(),
    `M=${operationMap(op)}`,
  ];
}

function writeArithmeticOps(op) {
  switch (op) {
    case 'add':
    case 'sub':
    case 'and':
    case 'or':
    case 'not':
      return withOpComment(op, combinationOp);
    case 'neg':
      return withOpComment(op, negOp);
    case 'eq':
    case 'gt':
    case 'lt':
      return withOpComment(op, comparatorOp);
    default:
      return ['not implemented']
  }
}

function asmWriter(cmdObject) {
  const { source, commandType, memory, index } = cmdObject;
  switch (commandType) {
    case C_ARITHMETIC: {
      return writeArithmeticOps(source);
    }
    case C_POP:
    case C_PUSH:
      return writePushPopOps(commandType, memory, index, source);
    default:
      throw new Error(`Unexpected commandType received: ${commandType}`)
  }
}

module.exports = asmWriter;
