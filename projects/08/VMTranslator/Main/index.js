const path = require('path');
const fs = require('fs');
const parser = require('../Parser');
const {
  asmWriter,
  getBootstrap,
  getFileEnd,
} = require('../CodeWriter')

async function isDirectory(filePath) {
  return fs.lstatSync(filePath).isDirectory();
}

async function getFiles(filePath) {
  return fs.readdirSync(filePath);
}

function includeBootstrap(filePath) {
  return ['SimpleFunction', 'FibonacciSeries', 'BasicLoop']
    .every((fileName) => !filePath.includes(fileName))
}

async function main(fileOrDirectory) {
  const filePath = path.resolve(fileOrDirectory);
  let asmFile;
  let targetPath;
  if (await isDirectory(filePath)) {
    const files = await getFiles(filePath);
    asmFile = await files.reduce(async (current, fileName) => {
      const currentFile = await current;
      if (/\.vm$/.test(fileName)) {
        const writer = asmWriter(fileName.split('.')[0]);
        const fileParser = parser(writer);
        const currentFilePath = path.resolve(fileOrDirectory, fileName);
        const vmFile = await readFile(currentFilePath);
        const asmPortion = fileParser(vmFile, fileName);
        return currentFile.concat(asmPortion);
      }
      return currentFile;
    }, Promise.resolve([]))
    const pathDirectories = filePath.split('/')
    const lastDirectory = pathDirectories[pathDirectories.length - 1]
    targetPath = path.resolve(filePath, `${lastDirectory}.asm`)
  } else {
    const filePaths = fileOrDirectory.split('/')
    const fileName = filePaths[filePaths.length - 1].split('.')[0]
    const writer = asmWriter(fileName);
    const fileParser = parser(writer);
    const vmFile = await readFile(filePath);
    asmFile = fileParser(vmFile);
    if (/\.vm$/.test(filePath)) {
      targetPath = filePath.replace(/\.vm$/, '.asm');
    } else {
      targetPath += '.asm'
    }
  }
  let completeFile = asmFile
  if (includeBootstrap(filePath)) {
    const bootstrap = getBootstrap();
    const endFile = getFileEnd();
    completeFile = [...bootstrap, ...asmFile, ...endFile];
  }
  await writefile(completeFile, targetPath);
}

// read file
async function readFile(filePath) {
  try {
    const fileContents = await fs.readFileSync(filePath, { encoding: 'utf8' });
    const vmFile = fileContents.split('\n');
    return vmFile;
  } catch (e) {
    console.log('error reading file');
    console.error(e);
  }
}

// write file
async function writefile(asmFile, target) {
  try {
    await fs.writeFileSync(target, asmFile.join('\n'), { encoding: 'utf8' });
  } catch (e) {
    console.log('error writing file');
    console.error(e);
    throw e;
  }
}

module.exports = main;