const fs = require('fs');

function xmlWriter() {
  let depth = 0;
  let stream;

  function addDepth() {
    const arr = new Array(depth)
    const str = arr.join('');
    return str;
  }

  function createStream(filePath) {
    stream = fs.createWriteStream(filePath, { flags: 'a' });
  }
  
  function writeTerminal(tag, contents) {
    stream.write(`${addDepth()}<${tag}> ${contents} </${tag}>\n`);
  }

  function writeTagStart(tag) {
    stream.write(`${addDepth()}<${tag}>\n`);
    depth = depth + 2;
  }

  function writeTagEnd(tag) {
    depth = depth - 2;
    stream.write(`${addDepth()}</${tag}>\n`);
  }

  function closeStream() {
    stream.end();
  }

  return {
    createStream,
    closeStream,
    writeTerminal,
    writeTagStart,
    writeTagEnd,
  }
}

module.exports  = xmlWriter;
