const path = require('path');
const fs = require('fs');
const tokenizer = require('../JackTokenizer');

async function isDirectory(filePath) {
  return fs.lstatSync(filePath).isDirectory();
}

async function getFiles(filePath) {
  return fs.readdirSync(filePath);
}

async function main(fileOrDirectory) {
  const filePath = path.resolve(fileOrDirectory);
  if (await isDirectory(filePath)) {
    const files = await getFiles(filePath);
    await files.forEach(async (fileName) => {
      if (/\.jack$/.test(fileName)) {
        const currentFilePath = path.resolve(fileOrDirectory, fileName);
        const tokenize = tokenizer()
        const jackFile = await readFile(currentFilePath);
        const tokens = tokenize(jackFile);
      }
    })
  } else {
    const tokenizer = Tokenizer()
    const jackFile = await readFile(filePath);
    const tokens = tokenizer(jackFile);
    console.log(tokens)
  }
}

async function readFile(filePath) {
  try {
    const fileContents = await fs.readFileSync(filePath, { encoding: 'utf8' });
    return fileContents;
  } catch (e) {
    console.log('error reading file');
    console.error(e);
  }
}

module.exports = main;
