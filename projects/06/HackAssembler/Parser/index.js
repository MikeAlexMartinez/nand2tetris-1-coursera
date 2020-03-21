function compose(...chain) {
  return (args) => chain.reduce((prev, current) => current(prev), args)
}

const trim = (str) => str.replace(/\s/, '')
const removeComments = (str) => str.split('//')[0]

const clean = compose(trim, removeComments);

const setInstructionType = ({ source, ...rest }) => ({
  source,
  type: source[0] === '@' ? 'A' : 'C',
  ...rest,
})

const parseCInstruction = (row) => {
  const [destAndCompute, jump] = row.split(';');
  let [destOrCompute, compute] = destAndCompute.split('=');
  if (!compute) {
    compute = destOrCompute;
    dest = '';
  } else {
    dest = destOrCompute;
  }
  return {
    compute,
    dest,
    jump: jump ? jump : '0',
  };
}

const parseAInstruction = (row) => ({
  address: row.substring(1),
})

const parseInstruction = ({ type, source, ...rest }) => ({
  type,
  source,
  elements: type === 'A'
    ? parseAInstruction(source)
    : parseCInstruction(source),
  ...rest,
})

const parseRow = (cleanRow) =>
  compose(
    setInstructionType,
    parseInstruction,
  )({ source: cleanRow });

function parser(codeAssembler) {
  const fileParser = (asmFile) => {
    let outputFile = [];
    asmFile.forEach((row) => {
      const cleanRow = clean(row);
      if (cleanRow) {
        const parsedRow = parseRow(cleanRow);
        const outputRow = codeAssembler(parsedRow);
        outputFile.push(outputRow);
      }
    });
    return outputFile;
  }

  return fileParser;
}


module.exports = parser;
