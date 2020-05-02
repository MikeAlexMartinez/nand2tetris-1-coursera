const path = require('path');
const fs = require('fs');
const tokenizer = require('../JackTokenizer');
const compilationEngine = require('../CompilationEngine');
const xmlWriter = require('../XmlWriter');
const { vmWriter } = require('../VmWriter');

async function isDirectory(filePath) {
  return fs.lstatSync(filePath).isDirectory();
}

async function getFiles(filePath) {
  return fs.readdirSync(filePath);
}

// Only needed if I want to write the output of the unprocessed token stream
// async function writeTokens(targetFile, tokenProvider) {
//   try {
//     const targetFileT = `${targetFile}Tokens.xml`
//     const writer = xmlWriter(targetFileT);
//     const { writeTagStart, writeTagEnd, writeTerminal, finish } = writer
//     writeTagStart('tokens');
//     while (tokenProvider.hasMoreTokens()) {
//       const token = tokenProvider.getToken();
//       writeTerminal(token);
//     }
//     writeTagEnd('tokens');
//     await finish();
//   } catch (e) {
//     console.error(e)
//   }
// }

async function main(fileOrDirectory) {
  const filePath = path.resolve(fileOrDirectory);
  if (await isDirectory(filePath)) {
    const files = await getFiles(filePath);
    await files.forEach(async (fileName) => {
      if (/\.jack$/.test(fileName)) {
        const currentFilePath = path.resolve(fileOrDirectory, fileName);
        await compileJackFile(currentFilePath);
      }
    })
  } else {
    await compileJackFile(filePath);
  }
}

async function compileJackFile(filePath) {
  const t = tokenizer()
  const jackFile = await readFile(filePath);
  t.tokenize(jackFile);
  // await writeTokens(currentFilePath, t);
  const targetXmlPath = filePath.replace(/.jack$/, '.xml');
  const targetVmPath = filePath.replace(/.jack$/, '.vm');
  const writer = xmlWriter(targetXmlPath);
  const vm = vmWriter(targetVmPath);
  const { compileClass } = compilationEngine(t, writer, vm)
  await compileClass();
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
