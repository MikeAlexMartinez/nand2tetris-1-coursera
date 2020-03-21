function compose(...chain) {
  return (args) => chain.reduce((prev, current) => current(prev), args)
}

const trim = (str) => str.replace(/\s/g, '')

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

const isSymbol = (address) => !(/^\d+$/.test(address))

const translateSymbol = (address, symbolTable) => {
  return symbolTable.has(address)
    ? symbolTable.get(address)
    : symbolTable.setVariable(address);
}

const parseAInstruction = (row, symbolTable) => {
  let address = row.substring(1);
  if (isSymbol(address)) {
    address = translateSymbol(address, symbolTable)
  }
  return {
    address,
  }
}

const parseInstruction = (symbolTable) => ({ type, source, ...rest }) => ({
  type,
  source,
  elements: type === 'A'
    ? parseAInstruction(source, symbolTable)
    : parseCInstruction(source),
  ...rest,
})

const parseRow = (cleanRow, symbolTable) =>
  compose(
    setInstructionType,
    parseInstruction(symbolTable),
  )({ source: cleanRow });

const extractSymbol = (symbolRow) => {
  return symbolRow.substring(1, symbolRow.length - 1);
}

const parseSymbols = (asmFile, symbolTable) => {
  let outputFile = [];
  let instructionAddress = 0;
  asmFile.forEach((row) => {
    const cleanRow = clean(row);
    if (cleanRow[0] === '(') {
      const symbolKey = extractSymbol(cleanRow);
      symbolTable.setLabel(symbolKey, instructionAddress);
    } else if (cleanRow) {
      outputFile.push(cleanRow);
      instructionAddress++;
    }
  })
  return outputFile
}

function parser(codeAssembler, symbolTable) {
  const fileParser = (asmFile) => {
    let outputFile = [];
    parseSymbols(asmFile, symbolTable).map((row) => {
      const parsedRow = parseRow(row, symbolTable);
      const outputRow = codeAssembler(parsedRow);
      outputFile.push(outputRow);
    });
    return outputFile;
  }

  return fileParser;
}

module.exports = parser;
