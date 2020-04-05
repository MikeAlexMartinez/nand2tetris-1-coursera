const { compose } = require('../Utils');
const mapCommand = require('../Mapping/mapCommand');

const trim = (str) => str.trim();

const removeComments = (str) => str.split('//')[0];

const clean = compose(trim, removeComments);

const split = (command) => {
  const [type, ...elements] = command.split(' ');
  return {
    source: command,
    commandType: mapCommand(type),
    elements,
  };
}

const parseRow = compose(split);

const setValueForAddress = (val, address, negate) => [
  `@${val}`,
  'D=A',
  ...(negate ? ['D=!D'] : []),
  `@${address}`,
  'M=D',
]

const genBootstrap = () => {
  return [
    '// Bootstrap Code',
    // set stack to 256
    ...setValueForAddress(256, 'SP'),
    // Set LCL ARG THIS and THAT to illegal
    // uninitialized values
    ...setValueForAddress(1, 'LCL', true),
    ...setValueForAddress(2, 'ARG', true),
    ...setValueForAddress(3, 'THIS', true),
    ...setValueForAddress(4, 'THAT', true),
    // Call Sys.init function
    '@Sys.init',
    '0; JMP',
  ]
}

function genEndFile() {
  return [
    '(END_OF_PROGRAM)',
    '@END_OF_PROGRAM',
    '0; JMP',
  ]
}

function parser(asmWriter) {
  const bootstrap = genBootstrap()
  const endFile = genEndFile()
  const fileParser = (vmFile) => {
    let outputFile = [];
    vmFile.forEach((row) => {
      const cleanRow = clean(row);
      if (cleanRow) {
        const parsedRow = parseRow(cleanRow);
        const asmRow = asmWriter(parsedRow);
        outputFile = outputFile.concat(asmRow);
      }
    });
    return bootstrap.concat(outputFile).concat(endFile);
  }

  return fileParser;
}

module.exports = parser;
