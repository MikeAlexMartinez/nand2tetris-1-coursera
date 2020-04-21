const keywords = [
  'class',
  'constructor',
  'function',
  'method',
  'field',
  'static',
  'var',
  'int',
  'char',
  'boolean',
  'void',
  'true',
  'false',
  'null',
  'this',
  'let',
  'do',
  'if',
  'else',
  'while',
  'return',
]

const removeCommentsRegex = /(\/\/[^\n]+)|(\/\*([\s\S]*?)\*\/)/g

function tokenizer() {
  let accessCount = 0
  let tokens = []

  const hasMoreTokens = () => {
    return accessCount < tokens.length
  }

  const getToken = () => {
    if (hasMoreTokens()) {
      const nextToken = tokens[accessCount]
      accessCount++
      return nextToken;
    }
    return null
  }

  const processToken = (t) => {
    const [value, stringConstant, identifierOrKeyword, integerConstant, space, symbol] = t
    if (value === stringConstant) {
      tokens.push({ value: value.replace(/\"/g, ''), type: 'stringConstant' })
    } else if (value === identifierOrKeyword) {
      if (keywords.includes(value)) {
        tokens.push({ value, type: 'keyword' })
      } else {
        tokens.push({ value, type: 'identifier' })
      }
    } else if (value === integerConstant) {
      tokens.push({ value, type: 'integerConstant' });
    } else if (value === symbol) {
      tokens.push({ value, type: 'symbol' });
    }
  }

  const tokenize = (file) => {
    const noComments = file.replace(removeCommentsRegex, '')
    const split = noComments.split(/\r\n|\r|\n/).filter(s => s.length > 0 && s !== '\r')

    split.forEach(line => {
      const trim = line.trim()
      let combinedRegex = /(\".*\")|(\b[a-zA-Z_]{1}\w*\b)|(\b\d{1,5}\b)|([\s]{1})|([\{\}\(\)\[\]\-\.\,\;\+\*\/\&\|\<\>\=\~]{1})/y
      while (t = combinedRegex.exec(trim)) {
        const token = t;
        processToken(token)
      }
    });

    return tokens;
  }

  return {
    tokenize,
    hasMoreTokens,
    getToken,
  }
}

module.exports = tokenizer
