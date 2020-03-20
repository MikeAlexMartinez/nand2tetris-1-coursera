

function compose(...chain) {
  return (args) => chain.reduce((prev, current) => current(prev), args)
}

const trim = (str) => str.replace(/\s/, '')
const removeComments = (str) => str.split('//')[0]

function rowParser(row) {
  const clean = compose(trim, removeComments);
  const cleanRow = clean(row);
  return cleanRow;
}

function fileParser(file) {
  
}

function parser(codeAssembler) {
  

}


module.exports = parser;
