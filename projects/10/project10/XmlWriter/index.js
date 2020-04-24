const fs = require('fs');

const htmlEntities = {
  ['<']: '&lt;',
  ['>']: '&gt;',
  ['"']: '&quot;',
  ['&']: '&amp;',
}

function xmlWriter(filePath) {
  let depth = 0;
  let fileEntries = []

  function addDepth() {

    const arr = new Array(depth).fill(' ')
    const str = arr.join('');
    return str;
  }

  function writeTerminal(token) {
    let { type, value } = token
    if (type === 'symbol') {
      if (htmlEntities.hasOwnProperty(value)) {
        value = htmlEntities[value];
      }
    }
    if (type === 'stringConstant') {
      value = `${value}`;
    }
    fileEntries.push(`${addDepth()}<${type}> ${value} </${type}>`);
  }

  function writeTagStart(type) {
    fileEntries.push(`${addDepth()}<${type}>`)
    depth = depth + 2
  }

  function writeTagEnd(type) {
    depth = depth - 2
    fileEntries.push(`${addDepth()}</${type}>`)
  }

  async function finish() {
    fileEntries.push('');
    try {
      await fs.writeFileSync(filePath, fileEntries.join('\n'), { encoding: 'utf8' });
    } catch (e) {
      console.log('error writing file');
      console.error(e);
      throw e;
    }
  }

  return {
    writeTerminal,
    writeTagStart,
    writeTagEnd,
    finish,
  }
}

module.exports  = xmlWriter;
