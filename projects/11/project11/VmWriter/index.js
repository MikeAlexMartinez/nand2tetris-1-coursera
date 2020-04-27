
// SEGMENTS
const CONST = 'constant'
const ARG = 'arg'
const LOCAL = 'local'
const STATIC = 'static'
const THIS = 'this'
const POINTER = 'pointer'
const TEMP = 'temp'

const segments = {
  CONST,
  ARG,
  LOCAL,
  STATIC,
  THIS,
  POINTER,
  TEMP,
}

// COMMANDS
const ADD = 'add';
const SUB = 'sub';
const NEG = 'neg';
const EQ = 'eq';
const GT = 'gt';
const LT = 'lt';
const AND = 'and';
const OR = 'or';
const NOT = 'not';

const commands = {
  ADD,
  SUB,
  NEG,
  EQ,
  GT,
  LT,
  AND,
  OR,
  NOT,
}

function vmWriter(targetPath) {
  fileEntries = []

  const writePush = (segment, index) => {
    fileEntries.push(`push ${segment} ${index}`);
  }

  const writePop = (segment, index) => {
    fileEntries.push(`pop ${segment} ${index}`);
  }

  const writeArithmetic = (command) => {
    fileEntries.push(command);
  }

  const writeLabel = (label) => {
    fileEntries.push(`goto ${label}`);
  }

  const writeGoto = (label) => {
    fileEntries.push(`if-goto ${label}`);
  }

  const writeIf = (label) => {
    fileEntries.push(`if-goto ${label}`);
  }

  const writeCall = (name, nArgs) => {
    fileEntries.push(`call ${name} ${nArgs}`);
  }

  const writeFunction = (name, nLocals) => {
    fileEntries.push(`function ${name} ${nLocals}`);
  }

  const writeReturn = () => {
    fileEntries.push('return');
  }

  const close = async () => {
    fileEntries.push('');
    try {
      await fs.writeFileSync(targetPath, fileEntries.join('\n'), { encoding: 'utf8' });
    } catch (e) {
      console.log('error writing file');
      console.error(e);
      throw e;
    }
  }

  return {
    writePush,
    writePop,
    writeArithmetic,
    writeLabel,
    writeGoto,
    writeIf,
    writeCall,
    writeFunction,
    writeReturn,
    close,
  };
}

module.exports = { vmWriter, commands, segments };
