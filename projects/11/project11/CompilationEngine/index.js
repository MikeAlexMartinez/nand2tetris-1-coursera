const { 
  VAR, STATIC, FIELD, ARGS, symbolTable
} = require('../SymbolTable');

const { commands, segments } = require('../VmWriter');
const labelGenerator = require('../LabelGenerator');

const isClassVarDec = (value) => ['static', 'field'].includes(value);
const notBrackets = (value) => value !== '(' && value !== ')';
const isNotSemiColon = (value) => value !== ';';
const isVar = (value) => value === 'var';
const isStatement = (value) => ['let', 'if', 'while', 'do', 'return'].includes(value);
const isElse = (value) => value === 'else';
const isLeftSquareBracket = (value) => value === '[';
const termIsSimpleConstant = (type) => ['stringConstant', 'keyword', 'integerConstant'].includes(type);
const notRightBracket = (value) => value !== ')';
const termIsSymbol = (type) => type === 'symbol';
const isSubroutineDec = (value) => ['constructor', 'function', 'method'].includes(value);
const isUnary = (value) => ['-', '~'].includes(value);
const isOpToken = (value) => ['+', '-', '*', '/', '&', '|', '<', '>', '='].includes(value);
const isNotComma = (value) => value !== ',';
const isComma = (value) => value === ',';

const callCounter = () => {
  let count = 0;

  const incCallCount = () => {count++};
  
  const getCallCount = () => count;

  return {
    incCallCount,
    getCallCount
  }
}

function compilationEngine(tokenProvider, xmlWriter, vmWriter) {
  const { define, varCount, kindOf, typeOf, indexOf, startSubroutine } = symbolTable();
  const { getToken, pushBack } = tokenProvider
  const { finish, writeTagStart, writeTagEnd, writeTerminal } = xmlWriter
  const { writePush, writePop, writeArithmetic, writeLabel, writeGoto,
    writeIf, writeCall, writeFunction, writeReturn, close } = vmWriter
  let getIfElseLabels, getIfLabels, getWhileLabels;
  let getFunctionLabel, getFunctionType, setFunctionType, setFunctionLabel;
  let className;

  // only required if we have written token file
  // resetCount();
  return { compileClass };

  async function compileClass() {
    writeTagStart('class');
    // keyword
    const keyword = getToken();
    writeTerminal(keyword);
    // identifier
    const classNameToken = getToken();
    writeTerminal(classNameToken);

    ;({
      getIfElseLabels, getIfLabels, getWhileLabels, getFunctionLabel,
      getFunctionType, setFunctionType, setFunctionLabel
    } = labelGenerator(classNameToken.value))
    className = classNameToken.value;

    // symbol
    const startSymbol = getToken();
    writeTerminal(startSymbol);

    let nextToken = getToken();
    while (isClassVarDec(nextToken.value)) {
      // compile class var declarations
      nextToken = compileClassVarDec(nextToken)
    }

    // compile class subroutines
    while (isSubroutineDec(nextToken.value)) {
      compileSubroutine(nextToken)
      nextToken = getToken();
    }

    // symbol
    writeTerminal(nextToken);
    writeTagEnd('class');
    await finish();
    await close();
  }

  function compileClassVarDec(nextToken) {
    writeTagStart('classVarDec');
    // static or field
    const kind = nextToken
    writeTerminal(nextToken);
    // type
    const typeToken = getToken();
    writeTerminal(typeToken);
    // varName
    let nameToken = getToken();
    writeTerminal(nameToken);

    define(nameToken.value, typeToken.value, kind.value);

    let repeatedVarNames = getToken();
    while (isNotSemiColon(repeatedVarNames.value)) {
      // comma
      writeTerminal(repeatedVarNames);
      // varName
      nameToken = getToken();
      writeTerminal(nameToken);
      repeatedVarNames = getToken();

      define(nameToken.value, typeToken.value, kind.value);
    }
    // semicolon
    writeTerminal(repeatedVarNames);
    writeTagEnd('classVarDec');
    return getToken();
  }

  function compileSubroutine(nextToken) {
    startSubroutine();

    writeTagStart('subroutineDec');
    // keyword
    if (!nextToken) {
      nextToken = getToken();
    }
    const funcType = nextToken.value
    writeTerminal(nextToken);
    // identifier
    const returnType = getToken();
    writeTerminal(returnType);

    // identifier
    const funcName = getToken();
    writeTerminal(funcName);

    // symbol
    const startSymbol = getToken();
    writeTerminal(startSymbol);

    // parameterList
    const endSymbol = compileParameterList();

    // store function information for use when 
    // I know the number of locals
    setFunctionType(funcType);
    setFunctionLabel(funcName.value);

    // symbol
    writeTerminal(endSymbol);

    // subroutineBody
    compileSubroutineBody();

    writeTagEnd('subroutineDec');
  }
  
  function compileSubroutineBody() {
    writeTagStart('subroutineBody');
    // {
    writeTerminal(getToken());
    // varDec*
    compileVarDec();

    // Now that I know locals, we can write the
    // function label.
    const nLocals = varCount(VAR);
    const funcLabel = getFunctionLabel()
    writeFunction(funcLabel, nLocals);

    const funcType = getFunctionType();
    if (funcType === 'constructor') {
      const nclassFields = varCount(FIELD);
      writePush(segments.CONST, nclassFields);
      writeCall('Memory.alloc', 1);
      writePop(segments.POINTER, 0);
    }

    if (funcType === 'method') {
      writePush(segments.ARG, 0);
      writePop(segments.POINTER, 0);
    }

    // statements
    compileStatements(getToken());
    // }
    writeTerminal(getToken());
    writeTagEnd('subroutineBody');
  }

  function compileParameterList() {
    writeTagStart('parameterList');

    let nextToken = getToken()
    while (notBrackets(nextToken.value)) {
      const typeToken = nextToken;
      writeTerminal(nextToken);
      const nameToken = getToken();
      writeTerminal(nameToken);

      define(nameToken.value, typeToken.value, ARGS);

      nextToken = getToken();
      if (isComma(nextToken.value)) {
        writeTerminal(nextToken);
        nextToken = getToken();
      }
    }

    writeTagEnd('parameterList');
    return nextToken;
  }

  function compileVarDec() {
    let varToken = getToken();
    if (isVar(varToken.value)) {
      while (isVar(varToken.value)) {
        writeTagStart('varDec');
        // var
        let kindToken = varToken;
        writeTerminal(varToken);
        // type
        const typeToken = getToken();
        writeTerminal(typeToken);
        // varName
        let nameToken = getToken();
        writeTerminal(nameToken);

        define(nameToken.value, typeToken.value, kindToken.value);

        let repeatedVarNames = getToken();
        while (isNotSemiColon(repeatedVarNames.value)) {
          // comma
          writeTerminal(repeatedVarNames);
          // varName
          nameToken = getToken();
          writeTerminal(nameToken);

          define(nameToken.value, typeToken.value, kindToken.value);
          repeatedVarNames = getToken();
        }
        // semicolon
        writeTerminal(repeatedVarNames);
        writeTagEnd('varDec');

        varToken = getToken();
      }
    }
    pushBack(1);
  }

  function compileStatements(nextToken) {
    writeTagStart('statements');
    if (!nextToken) {
      nextToken = getToken()
    }
    while (isStatement(nextToken.value)) {
      switch (nextToken.value) {
        case 'let':
          compileLet(nextToken)
          break;
        case 'if':
          compileIf(nextToken)
          break;
        case 'while':
          compileWhile(nextToken)
          break;
        case 'do':
          compileDo(nextToken)
          break;
        case 'return':
          compileReturn(nextToken)
          break;
      }
      nextToken = getToken();
    }
    pushBack(1);
    writeTagEnd('statements');
  }

  function compileDo(doToken) {
    writeTagStart('doStatement');
    // do
    writeTerminal(doToken);

    // subRoutineName(expressionList)
    // (className | varName).subroutineName(expressionList) 
    const varOrClassName = getToken();
    writeTerminal(varOrClassName);

    let funcName = varOrClassName.value
    const type = typeOf(funcName);
    const { incCallCount, getCallCount } = callCounter()
    
    // . or (
      let nextToken = getToken();

    let otherClass = false
    if (notBrackets(nextToken.value)) {
      otherClass = true

      // .
      writeTerminal(nextToken)
      // subroutineName
      const subroutineNameToken = getToken()
      writeTerminal(subroutineNameToken);

      if (type) {
        const kind = kindOf(funcName);
        const index = indexOf(funcName);
        writePush(kind, index);
        incCallCount();
        funcName = `${type}.${subroutineNameToken.value}`
      } else {
        funcName += `.${subroutineNameToken.value}`
      }

      nextToken = getToken();
    }

    // (
    writeTerminal(nextToken);
    // expressionList
    compileExpressionList(getToken(), incCallCount);
    // )
    writeTerminal(getToken());

    // call function
    if (!otherClass) {
      funcName = `${className}.${funcName}`
      incCallCount()
      writePush(segments.POINTER, 0);
    }
    let nArgs = getCallCount();
    writeCall(funcName, nArgs);
    // do calls return nothing so remove returned
    // constant 0
    writePop(segments.TEMP, 0);

    // semi-colon
    writeTerminal(getToken());

    writeTagEnd('doStatement');
  }

  function compileLet(letToken) {
    writeTagStart('letStatement');
    // let
    writeTerminal(letToken);
    // varName
    const varNameToken = getToken();
    writeTerminal(varNameToken);
    const varIndex = indexOf(varNameToken.value);
    const varSegment = kindOf(varNameToken.value);

    // squareBracket?
    let couldBeSquare = getToken();
    if (isLeftSquareBracket(couldBeSquare.value)) {
      writeTerminal(couldBeSquare);
      // expression
      compileExpression(getToken());
      // endSquare
      writeTerminal(getToken());

      couldBeSquare = getToken();
    }
    // equals
    writeTerminal(couldBeSquare);

    // expression
    compileExpression(getToken());

    // Assign value at top of stack to
    // variable
    writePop(varSegment, varIndex);

    // ;
    writeTerminal(getToken());
    writeTagEnd('letStatement');
  }

  function compileWhile(whileToken) {
    const { startLabel_L1, exitLabel_L2 } = getWhileLabels()
    writeLabel(startLabel_L1);

    writeTagStart('whileStatement');
    // while
    writeTerminal(whileToken);
    // (
    writeTerminal(getToken());

    // expression
    compileExpression(getToken());

    // negate value at top of stack
    writeArithmetic('not');
    // evaluate if statement
    writeIf(exitLabel_L2);

    // )
    writeTerminal(getToken());

    // {
    writeTerminal(getToken());

    // statements
    compileStatements(getToken());

    // }
    writeTerminal(getToken());
    writeTagEnd('whileStatement');

    // go to top of loop
    writeGoto(startLabel_L1);
    // End Label
    writeLabel(exitLabel_L2);
  }

  function compileReturn(returnToken) {
    writeTagStart('returnStatement');

    // return
    writeTerminal(returnToken);
    // expression ?
    const couldBeSemiColon = getToken();
    let isVoid = true
    if (isNotSemiColon(couldBeSemiColon.value)) {
      isVoid = false
      compileExpression(couldBeSemiColon);
    } else {
      writePush(segments.CONST, 0);
      pushBack(1);
    }

    writeReturn();

    // semicolon
    writeTerminal(getToken());
    writeTagEnd('returnStatement');
  }

  function compileIf(ifToken) {
    const { ifTrue, ifFalse, ifEnd } = getIfElseLabels()
    writeTagStart('ifStatement');
    // if
    writeTerminal(ifToken);
    // (
    writeTerminal(getToken());

    // expression
    compileExpression(getToken());

    // )
    writeTerminal(getToken());

    writeIf(ifTrue)
    writeGoto(ifFalse)
    writeLabel(ifTrue)

    // {
    writeTerminal(getToken());

    // statements
    compileStatements(getToken());
    
    // }
    writeTerminal(getToken());
    
    const couldBeElse = getToken();
    if (isElse(couldBeElse.value)) {
      writeGoto(ifEnd)
      writeLabel(ifFalse);

      writeTerminal(couldBeElse);
      // {
      writeTerminal(getToken());
      // statements
      compileStatements(getToken());
      // }
      writeTerminal(getToken());
      writeLabel(ifEnd)
    } else {
      writeLabel(ifFalse);
      pushBack(1);
    }
    writeTagEnd('ifStatement');
  }

  function compileExpression(firstToken) {
    writeTagStart('expression')
    // compile Term
    compileTerm(firstToken);
    // 0 or more times
    let opToken = getToken();
    while (isOpToken(opToken.value)) {
      // compile op
      writeTerminal(opToken);
      // compile term
      const termToken = getToken();
      compileTerm(termToken);

      switch (opToken.value) {
        case '*':
          writeCall('Math.multiply', 2);
          break;
        case '/':
          writeCall('Math.divide', 2);
          break;
        default:
          // push operation on to stack
          writeArithmetic(opToken.value)
      }

      opToken = getToken();
    }
    pushBack(1);
    writeTagEnd('expression');
  }

  function compileTerm(firstTerm) {
    writeTagStart('term');
    // one of
    // integerConstant
    // stringConstant
    // keyword
    if (termIsSimpleConstant(firstTerm.type)) {
      writeTerminal(firstTerm)

      if (firstTerm.type === 'integerConstant') {
        writePush(segments.CONST, firstTerm.value);
      }

      if (firstTerm.type === 'stringConstant') {
        const stringValue = firstTerm.value
        const length = stringValue.length
        writePush(segments.CONST, length);
        writeCall('String.new', 1);
        for (let i = 0; i < length; i ++) {
          const code = stringValue.charCodeAt(i);
          writePush(segments.CONST, code);
          writeCall('String.appendChar', 2);
        }
      }

      // true, false, null, this
      if (firstTerm.type === 'keyword') {
        switch (firstTerm.value) {
          case 'true':
            writePush(segments.CONST, 0);
            writeArithmetic('not');
            break;
          case 'false':
          case 'null':
            writePush(segments.CONST, 0);
            break;
          case 'this':
            writePush(segments.POINTER, 0);
        }
      }

      // need to handle string statements

    } else if (termIsSymbol(firstTerm.type)) {
      // symbol
      if (isUnary(firstTerm.value)){
        // unary op
        writeTerminal(firstTerm);
        compileTerm(getToken());
        if (firstTerm.value === '~') {
          writeArithmetic('not');
        } else {
          // negate value of term
          writeArithmetic('neg');
        }
      } else {
        // ( expression )
        writeTerminal(firstTerm)
        compileExpression(getToken());
        const endBracket = getToken();
        writeTerminal(endBracket);
      }

    } else {
      // identifier
      writeTerminal(firstTerm);
      let lookAhead = getToken();
      switch (lookAhead.value) {
        // varName [ expression ]
        case '[':
          writeTerminal(lookAhead);
          // expression
          compileExpression(getToken());
          // ]
          writeTerminal(getToken());
          break;
        // varName '(' expressionList ')'
        case '(': {
          const { incCallCount, getCallCount } = callCounter();
          const funcLabel = `${className}.${firstTerm.value}`;
          writeFunctionCall(lookAhead, incCallCount);
          writeCall(funcLabel, getCallCount());
          break;
        }
        // varName.varName()
        case '.': {
          // varName
          writeTerminal(lookAhead);
          
          // '.'
          const subroutineName = getToken();
          writeTerminal(subroutineName);
          // varName '(' expressionList ')'
          const { incCallCount, getCallCount } = callCounter();
          const funcLabel = `${firstTerm.value}.${subroutineName.value}`;
          writeFunctionCall(getToken(), incCallCount);
          writeCall(funcLabel, getCallCount());
          break;
        }
        case ')':
        case ']':
        default: {
          const { type, value } = firstTerm
          if (type === 'identifier') {
            const segment = kindOf(value);
            const index = indexOf(value);
            writePush(segment, index);
          }
          pushBack(1);
        }

      }
    }
    writeTagEnd('term');
  }

  function writeFunctionCall(varName, incCallCount) {
    // if targetClassName append with 

    // varName
    writeTerminal(varName);
    // left bracket
    // expressionList
    const expressionToken = getToken()
    compileExpressionList(expressionToken, incCallCount);

    // right bracket
    writeTerminal(getToken());
  }

  function compileExpressionList(firstToken, incCallCount) {
    writeTagStart('expressionList');
    if (notRightBracket(firstToken.value)) {
      compileExpression(firstToken);
      incCallCount();
      let nextToken = getToken();
      while(notBrackets(nextToken.value)) {
        // ','
        writeTerminal(nextToken);
        // expression
        compileExpression(getToken());
        incCallCount();
        nextToken = getToken();
      }
    }
    pushBack(1);
    writeTagEnd('expressionList');
  }
}

module.exports = compilationEngine;
