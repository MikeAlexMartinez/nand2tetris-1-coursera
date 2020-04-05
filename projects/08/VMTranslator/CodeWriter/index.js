const {
  C_PUSH,
  C_POP,
  C_ARITHMETIC,
  C_LABEL,
  C_GOTO,
  C_IF,
  C_FUNCTION,
  C_RETURNS,
  C_CALL,
} = require('../Mapping/constants')

function labelGenerator() {
  let labelCount = 0;
  let functionMap = {}

  const getFunctionReturn = ({
    fileName = '__',
    functionName,
  }) => {
    let count
    if (Object.hasOwnProperty.call(functionMap, functionName)) {
      count = ++functionMap[functionName]
    } else {
      count = 1
      functionMap[functionName] = count
    }
    return `${fileName}.${functionName}$ret.${count}`;
  }

  const getNext = () => ({
    nextAddress: `@NEXT.${labelCount}`,
    nextLabel: `(NEXT.${labelCount})`,
  });

  const getEnd = () => ({
    endAddress: `@END.${labelCount}`,
    endLabel: `(END.${labelCount})`,
  });

  const getLabels = () => {
    labelCount++;
    return {
      getNext,
      getEnd
    };
  };

  return {
    getLabels,
    getFunctionReturn,
  };
}

const { getLabels, getFunctionReturn } = labelGenerator();

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

function writeLabel(label) {
  return [`(${label})`];
}

function writeGoTo(label) {
  return [
    `@${label}`,
    `0; JMP`,
  ]
}

function getJumpType(lastArithmeticOp) {
  const jumps = {
    // For encountered counters, if counter > 0, jump
    sub: 'JGT',
    add: 'JGT',
    // Booleans, if -1 then evaluates to true
    eq: 'JLT',
    lt: 'JLT',
    gt: 'JLT',
    // default to JEQ otherwise
    neg: 'JEQ',
    and: 'JEQ',
    or: 'JEQ',
    not: 'JEQ',
  };
  return jumps[lastArithmeticOp];
}

function writeIfGoTo(label, lastArithmeticOp) {
  const jumpType = getJumpType(lastArithmeticOp)
  return [
    '@SP',
    'AM=M-1',
    'D=M',
    `@${label}`,
    `D; ${jumpType}`,
  ]
}

function addComment(source, commands) {
  return [`// ${source}`, ...commands]
}

function addLocals(vars) {
  let locals = []
  // initialise locals to 0 and move SP
  for (let i = 0; i < vars; i++) {
    locals.push('@SP');
    locals.push('A=M');
    locals.push('M=0');
    locals.push('@SP');
    locals.push('M=M+1');
  }
  return locals;
}

function writeFunction(functionName, nVars) {
  return [
    // Add label
    `(${functionName})`,
    // Add required locals
    ...addLocals(nVars),
  ]
}

// push address on to stack
function pushAddress(address, isPointer) {
  return [
    `@${address}`,
    `D=${isPointer ? 'M' : 'A'}`,
    '@SP',
    'A=M',
    'M=D',
    '@SP',
    'M=M+1',
  ]
}

function writeCall(functionName, nArgs) {
  const returnAddress = getFunctionReturn({ functionName })
  return [
    ...pushAddress(returnAddress),
    ...pushAddress('LCL', true),
    ...pushAddress('ARG', true),
    ...pushAddress('THIS', true),
    ...pushAddress('THAT', true),
    // ARG = SP-n-5
    `@${nArgs}`,
    'D=A',
    '@5',
    'D=D+A',
    '@SP',
    'D=M-D',
    '@ARG',
    'M=D',
    // LCL = SP
    '@SP',
    'D=M',
    '@LCL',
    'M=D',
    // goto functionName
    `@${functionName}`,
    '0; JMP',
    // Give return address
    `(${returnAddress})`,
  ]
}

function updateFrameMinusN(target, n) {
  return [
    `@${n}`,
    'D=A', // D = n
    '@R13',
    'A=M-D', // set address to topOfFrame - n
    'D=M', // store value in D
    `@${target}`,
    'M=D', // set target address to value in D
  ]
}

function writeReturn() {
  return [
    // FRAME = LCL
    '@LCL',
    'D=M',
    '@R13',
    'M=D',
    // RET = *(FRAME-5)
    // Where RET is the ROM position to continue from
    ...updateFrameMinusN('R14', 5),
    // *ARG = pop()
    '@SP',
    'AM=M-1',
    'D=M',
    '@ARG',
    'A=M',
    'M=D',
    // SP = ARG+1
    '@ARG',
    'D=M+1',
    '@SP',
    'M=D',
    // THAT = *(FRAME-1)
    ...updateFrameMinusN('THAT', 1),
    // THIS = *(FRAME-2)
    ...updateFrameMinusN('THIS', 2),
    // ARG = *(FRAME-3)
    ...updateFrameMinusN('ARG', 3),
    // LCL = *(FRAME-4)
    ...updateFrameMinusN('LCL', 4),
    // goto RET
    '@R14',
    'A=M',
    'D; JMP',
  ]
}

function asmWriter() {
  let latestArithmetic = ''

  return (cmdObject) => {
    const { source, commandType, elements } = cmdObject;
    switch (commandType) {
      case C_ARITHMETIC: {
        latestArithmetic = source;
        return writeArithmeticOps(source);
      }
      case C_POP:
      case C_PUSH:
        const [memory, index] = elements;
        return writePushPopOps(commandType, memory, index, source);
      case C_LABEL: {
        const [label] = elements;
        return addComment(source, writeLabel(label));
      }
      case C_GOTO: {
        const [label] = elements;
        return addComment(source, writeGoTo(label));
      }
      case C_IF: {
        const [label] = elements;
        return addComment(source, writeIfGoTo(label, latestArithmetic));
      }
      case C_FUNCTION: {
        const [functionName, vars] = elements;
        return addComment(source, writeFunction(functionName, vars));
      }
      case C_CALL: {
        const [functionName, args] = elements;
        return addComment(source, writeCall(functionName, args));
      }
      case C_RETURNS: {
        return addComment(source, writeReturn());
      }
      default:
        throw new Error(`Unexpected commandType received: ${commandType}`)
    }
  }
}
module.exports = asmWriter;
