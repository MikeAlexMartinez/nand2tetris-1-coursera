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

const genBootstrap = () => {
  return [
    '// Bootstrap Code',
    // set stack to 256
    '@SP',
    'M=256',
    // Set LCL ARG THIS and THAT to illegal
    // uninitialized values
    '@LCL',
    'M=-1',
    '@ARG',
    'M=-2',
    '@THIS',
    'M=-3',
    '@THAT',
    'M=-4',
    // Call Sys.init function
    '@Sys.init',
    '0; JMP',
  ]
}

function parser(asmWriter) {
  const bootstrap = genBootstrap()
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
    return bootstrap.concat(outputFile);
  }

  return fileParser;
}

module.exports = parser;
