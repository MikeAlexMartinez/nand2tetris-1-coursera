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

  function writeTerminal(tag, contents) {
    if (tag === 'symbol') {
      if (htmlEntities.hasOwnProperty(contents)) {
        contents = htmlEntities[contents];
      }
    }
    if (tag === 'stringConstant') {
      contents = `${contents}`;
    }
    fileEntries.push(`${addDepth()}<${tag}> ${contents} </${tag}>`);
  }

  function writeTagStart(tag) {
    fileEntries.push(`${addDepth()}<${tag}>`)
  }

  function writeTagEnd(tag) {
    fileEntries.push(`${addDepth()}</${tag}>`)
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
