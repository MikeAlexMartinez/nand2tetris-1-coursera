const prefinedSymbols = {
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,
  SCREEN: 16384,
  KDB: 24576,
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
}

function SymbolTable(baseMemory = 16) {
  let nextMemoryLocation = baseMemory;
  const symbols = {
    ...prefinedSymbols
  };

  const has = (key) => {
    return Object.hasOwnProperty.call(symbols, key);
  }

  const addSymbol = (key, value) => {
    symbols[key] = value;
  }

  const setVariable = (key) => {
    const value = nextMemoryLocation;
    addSymbol(key, value);
    nextMemoryLocation++;
  }

  const setLabel = (key, value) => {
    addSymbol(key, value);
  }

  const get = (key) => {
    return symbols[key];
  }

  return {
    has, setLabel, setVariable, get,
  }
}
