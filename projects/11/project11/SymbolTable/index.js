const STATIC = 'static';
const FIELD = 'this';
const ARGS = 'args';
const VAR = 'var';

function symbolTable() {
  const classSymbols = {};
  let subroutineSymbols = {};
  let counts = {
    [STATIC]: 0,
    [FIELD]: 0,
    [ARGS]: 0,
    [VAR]: 0,
  }

  const define = (name, type, kind) => {
    if (kind === 'field') { kind = 'this' }
    switch (kind) {
      case STATIC:
      case FIELD: {
        classSymbols[name] = {
          type,
          kind,
          count: counts[kind],
        };
        counts[kind]++;
        break;
      }
      case ARGS:
      case VAR: {
        const count = counts[kind];
        subroutineSymbols[name] = {
          type,
          kind,
          count,
        };
        counts[kind]++;
        break;
      }
    }
  }
  
  const varCount = (kind) => {
    return counts[kind];
  }
  
  const propOf = (prop, name) => {
    if (subroutineSymbols.hasOwnProperty(name)) {
      return subroutineSymbols[name][prop];
    }
    if (classSymbols.hasOwnProperty(name)) {
      return classSymbols[name][prop];
    }
    // throw new Error(`Symbol ${name} is undefined`);
  }

  const kindOf = (name) => {
    const map = {
      [STATIC]: 'static',
      [FIELD]: 'this',
      [ARGS]: 'argument',
      [VAR]: 'local',
    }
    return map[propOf('kind', name)];
  }

  const typeOf = (name) => {
    return propOf('type', name);
  }

  const indexOf = (name) => {
    return propOf('count', name);
  }

  const startSubroutine = () => {
    subroutineSymbols = {};
    counts[ARGS] = 0;
    counts[VAR] = 0;
  }

  return {
    define,
    varCount,
    kindOf,
    typeOf,
    indexOf,
    startSubroutine,
  }
}

module.exports = {
  STATIC,
  FIELD,
  ARGS,
  VAR,
  symbolTable,
};
