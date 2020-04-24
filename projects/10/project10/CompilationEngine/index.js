const isClassVarDec = (value) => ['static', 'field'].includes(value);
const notBrackets = (value) => value !== '(' && value !== ')';
const isNotSemiColon = (value) => value !== ';';
const isVar = (value) => value === 'var';
const isStatement = (value) => ['let', 'if', 'while', 'do', 'return'].includes(value);
const isElse = (value) => value === 'else';
const isLeftSquareBracket = (value) => value === '[';
const termIsSimpleConstant = (type) => ['stringConstant', 'keyword', 'integerConstant'].includes(type);
const termIsEndBracket = (value) => [')', ']'].includes(value);
const termIsSymbol = (type) => type === 'symbol';
const isSubroutineDec = (value) => ['constructor', 'function', 'method'].includes(value);
const isUnary = (value) => ['-', '~'].includes(value);
const isOpToken = (value) => ['+', '-', '*', '/', '&', '|', '<', '>', '='].includes(value);

function compilationEngine(tokenProvider, xmlWriter) {
  const { resetCount, getToken, hasMoreTokens, pushBack } = tokenProvider
  const { finish, writeTagStart, writeTagEnd, writeTerminal } = xmlWriter

  // only required if we have written token file
  resetCount();
  return { compileClass };

  async function compileClass() {
    writeTagStart('class');
    const keyword = getToken();
    // keyword
    writeTerminal(keyword);
    // identifier
    const identifier = getToken();
    writeTerminal(identifier);
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
  }

  function compileClassVarDec(nextToken) {
    writeTagStart('classVarDec');
    // static or field
    writeTerminal(nextToken);
    // type
    writeTerminal(getToken());
    // varName
    writeTerminal(getToken());
    let repeatedVarNames = getToken();
    while (isNotSemiColon(repeatedVarNames.value)) {
      // comma
      writeTerminal(repeatedVarNames);
      // varName
      writeTerminal(getToken());
      repeatedVarNames = getToken();
    }
    // semicolon
    writeTerminal(repeatedVarNames);
    writeTagEnd('classVarDec');
    return getToken();
  }

  function compileSubroutine(nextToken) {
    writeTagStart('subroutineDec');
    // keyword
    if (!nextToken) {
      nextToken = getToken();
    }
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
      writeTerminal(nextToken);
      nextToken = getToken();
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
        writeTerminal(varToken);
        // type
        writeTerminal(getToken());
        // varName
        writeTerminal(getToken());

        let repeatedVarNames = getToken();
        while (isNotSemiColon(repeatedVarNames.value)) {
          // comma
          writeTerminal(repeatedVarNames);
          // varName
          writeTerminal(getToken());
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

    // . or (
    let nextToken = getToken();
    if (notBrackets(nextToken.value)) {
      // .
      writeTerminal(nextToken)
      // subroutineName
      writeTerminal(getToken());
      nextToken = getToken();
    }
    // (
    writeTerminal(nextToken);
    // expressionList
    compileExpressionList(getToken());
    // )
    writeTerminal(getToken());

    // semi-colon
    writeTerminal(getToken());

    writeTagEnd('doStatement');
  }

  function compileLet(letToken) {
    writeTagStart('letStatement');
    // let
    writeTerminal(letToken);
    // varName
    writeTerminal(getToken());

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

    // ;
    writeTerminal(getToken());
    writeTagEnd('letStatement');
  }

  function compileWhile(whileToken) {
    writeTagStart('whileStatement');
    // while
    writeTerminal(whileToken);
    // (
    writeTerminal(getToken());

    // expression
    compileExpression(getToken());

    // )
    writeTerminal(getToken());

    // {
    writeTerminal(getToken());

    // statements
    compileStatements(getToken());

    // }
    writeTerminal(getToken());
    writeTagEnd('whileStatement');
  }

  function compileReturn(returnToken) {
    writeTagStart('returnStatement');
    // return
    writeTerminal(returnToken);
    // expression ?
    const couldBeSemiColon = getToken();
    if (isNotSemiColon(couldBeSemiColon.value)) {
      compileExpression(couldBeSemiColon);
    } else {
      pushBack(1);
    }

    // semicolon
    writeTerminal(getToken());
    writeTagEnd('returnStatement');
  }

  function compileIf(ifToken) {
    writeTagStart('ifStatement');
    // if
    writeTerminal(ifToken);
    // (
    writeTerminal(getToken());

    // expression
    compileExpression(getToken());

    // )
    writeTerminal(getToken());

    // {
    writeTerminal(getToken());

    // statements
    compileStatements(getToken());

    // }
    writeTerminal(getToken());

    const couldBeElse = getToken();
    if (isElse(couldBeElse.value)) {
      writeTerminal(couldBeElse);
      // {
      writeTerminal(getToken());
      // statements
      compileStatements(getToken());
      // }
      writeTerminal(getToken());
    } else {
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
      compileTerm(getToken());

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
    console.log(firstTerm);
    if (termIsSimpleConstant(firstTerm.type)) {
      writeTerminal(firstTerm)
    } else if (termIsSymbol(firstTerm.type)) {
      // symbol
      if (isUnary(firstTerm.value)){
        // unary op
        writeTerminal(firstTerm);
        compileTerm(getToken());
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
        case '(':
          writeFunctionCall(lookAhead);
          break;
        // varName.varName()
        case '.':
          // varName
          writeTerminal(lookAhead);
          // '.'
          writeTerminal(getToken());
          // varName '(' expressionList ')'
          writeFunctionCall(getToken());
          break;
        case ')':
        case ']':
        default:
          pushBack(1);
      }
    }
    writeTagEnd('term');
  }

  function writeFunctionCall(varName) {
    // varName
    writeTerminal(varName);
    // left bracket
    // expressionList
    compileExpressionList(getToken());

    // right bracket
    writeTerminal(getToken());
  }

  function compileExpressionList(firstToken) {
    writeTagStart('expressionList');
    if (notBrackets(firstToken.value)) {
      compileExpression(firstToken);
  
      let nextToken = getToken();
      while(notBrackets(nextToken.value)) {
        // ','
        writeTerminal(nextToken);
        // expression
        compileExpression(getToken());
        nextToken = getToken();
      }
    }
    pushBack(1);
    writeTagEnd('expressionList');
  }
}

module.exports = compilationEngine;
