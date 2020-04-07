const { compose } = require('../Utils');
const mapCommand = require('../Mapping/mapCommand');

const trim = (str) => str.trim();

const removeComments = (str) => str.split('//')[0];

const clean = compose(removeComments, trim);

const split = (command) => {
  const [type, ...elements] = command.split(' ');
  return {
    source: command,
    commandType: mapCommand(type),
    elements,
  };
}

const parseRow = compose(split);

function parser(asmWriter) {
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
    return outputFile;
  }
  return fileParser;
}

module.exports = parser;
