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

function memorySegmentMap(memory) {
  const map = {
    local: 'LCL',
    argument: 'ARG',
    this: 'THIS',
    that: 'THAT',
  }
  return map[memory];
}

function getBase(memory, index) {
  switch (memory) {
    case 'static':
      return 16;
    case 'temp':
      return 5;
    case 'pointer':
      return ['THIS', 'THAT'][index];
    default:
      return memorySegmentMap(memory);
  }
}

function genericPush() {
  return [
    'D=M', // store value from address in D
    '@SP', // get stack pointer
    'A=M', // store address from pointer in A-register
    'M=D', // set value from D at top of stack
    '@SP', 
    'M=M+1', // move stack pointer up by 1
  ];
}

function pushWithStatic(address) {
  return [
    `@${address}`, // create memory offset value
    ...genericPush(),
  ];
}

function pushWithPointer(base, index) {
  return [
    `@${index}`, // create memory offset value
    'D=A', // store in D-register
    `@${base}`, // select base of memory segment
    'A=D+M', // set Address to base + offset
    ...genericPush(),
  ];
}

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

function writePushOp(memory, index, source) {
  const base = getBase(memory, index);
  switch (memory) {
    // constant is push only
    case 'constant':
      return [`// ${source}`, ...pushConstant(index)];
    case 'argument':
    case 'local':
    case 'this':
    case 'that':
      return [`// ${source}`, ...pushWithPointer(base, index)]
    case 'static':
    case 'temp': {
      const address = Number(base) + Number(index);
      return [`// ${source}`, ...pushWithStatic(address)];
    }
    case 'pointer':
      return [`// ${source}`, ...pushWithStatic(base)]
    default:
      throw Error(`memory segment is invalid: ${memory}`)
  }
}

function popWithStaticAddress(address) {
  return [
    '@SP',
    'AM=M-1',
    'D=M',
    `@${address}`,
    'M=D',
  ];
}

function popWithPointerAddress(base, index) {
  return [
    `@${index}`,
    'D=A',
    `@${base}`,
    'D=D+M',
    '@R13',
    'M=D',
    '@SP',
    'AM=M-1',
    'D=M',
    '@R13',
    'A=M',
    'M=D',
  ];
}

function writePopOp(memory, index, source) {
  const base = getBase(memory, index);
  if (memory === 'pointer') {
    return [`// ${source}`, ...popWithStaticAddress(base)];
  } else if (memory === 'static' || memory === 'temp') {
    const address = Number(base) + Number(index);
    return [`// ${source}`, ...popWithStaticAddress(address)];
  }
  return [`// ${source}`, ...popWithPointerAddress(base, index)];
}

function writePushPopOps(commandType, memory, index, source) {
  return commandType === C_PUSH
    ? writePushOp(memory, index, source)
    : writePopOp(memory, index, source);
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
    neg: '-M',
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
    'D=M-D',
    nextAddress, // next
    `D; ${operationMap(op)}`,
    '@SP',
    'A=M-1',
    'M=0', // return 0
    endAddress, // go to end
    '0; JMP', //unconditional jump
    nextLabel, // <= next
    '@SP',
    'A=M-1',
    'M=-1', //, return -1
    endLabel, //, end
  ];
}

function singleOp(op) {
  return [
    `@SP`,
    'A=M-1',
    `M=${operationMap(op)}`,
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
      return withOpComment(op, combinationOp);
    case 'not':
    case 'neg':
      return withOpComment(op, singleOp);
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
