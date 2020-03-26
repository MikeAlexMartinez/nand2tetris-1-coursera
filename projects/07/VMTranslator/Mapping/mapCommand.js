const { C_PUSH, C_POP, C_ARITHMETIC } = require('../mapping/constants');

const arithmeticCommands = [
  'add',
  'sub',
  'neg',
  'eq',
  'gt',
  'lt',
  'and',
  'or',
  'not',
];

const isArithmetic = (type) => arithmeticCommands.includes(type);

function mapCommand(type) {
  if (isArithmetic(type)) return C_ARITHMETIC;
  switch(type) {
    case 'push':
      return C_PUSH;
    case 'pop':
      return C_POP;
    default:
      throw new Error(`Unexpected command type, received: ${type}`);
  }
}

module.exports = mapCommand;
