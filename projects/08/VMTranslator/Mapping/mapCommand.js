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
} = require('./constants');

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
    case 'label':
      return C_LABEL;
    case 'if-goto':
      return C_IF;
    case 'goto':
      return C_GOTO;
    default:
      throw new Error(`Unexpected command type, received: ${type}`);
  }
}

module.exports = mapCommand;
