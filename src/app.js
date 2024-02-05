import { createInterface } from 'node:readline';
import { createReadStream, createWriteStream } from 'node:fs';
import {
  readdir,
  readFile,
  writeFile,
  access,
  rename,
  mkdir,
  rm as deleteFile,
} from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { resolve, dirname, basename, extname } from 'node:path';
import { createHash } from 'node:crypto';
import {
  showCurrentDirectory,
  showInvalidInput,
  showError,
} from './utils/alertMessages.js';
import { checkExistence } from './utils/validators.js';
import { systemInfoSwitch } from './utils/systemInfo.js';
import { compressDecompress } from './utils/compressor.js';
import commandMap from './utils/commands.js';


const consoleInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

export class FileManagerApp {
  constructor(initialDir) {
    this.workingDir = initialDir;
  }

  goUp() {
    this.workingDir = dirname(this.workingDir);
  }

  async changeDir(args) {
    const newPath = resolve(this.workingDir, ...args);
    console.log(newPath);
    (await checkExistence(newPath))
      ? (this.workingDir = newPath)
      : showInvalidInput();
  }

  async list() {
    const items = await readdir(this.workingDir, { withFileTypes: true });
    const sortedItems = items
      .filter((item) => !item.isSymbolicLink())
      .sort((a, b) => a.isFile() - b.isFile())
      .map((el) => ({
        name: el.name,
        type: el.isDirectory() ? 'directory' : 'file',
      }));
    console.table(sortedItems);
  }

  async viewFile([filePath]) {
    const fileLocation = resolve(this.workingDir, filePath);
    await access(fileLocation);
    const fileStream = createReadStream(fileLocation);
    await new Promise((resolve, reject) => {
      let data = '';
      fileStream.on('data', (chunk) => (data += chunk));
      fileStream.on('end', () => {
        console.log(data);
        resolve();
      });
      fileStream.on('error', () => {
        showError();
        reject();
      });
    });
  }

  async createFile([fileName]) {
    const file = resolve(this.workingDir, fileName);
    await writeFile(file, '', { flag: 'wx' });
  }

  async renameFile([oldFile, newFileName]) {
    const originalFile = resolve(this.workingDir, oldFile);
    const newFilePath = resolve(this.workingDir, newFileName);
    await rename(originalFile, newFilePath);
  }

  async copyFile([sourceFile, destinationDir]) {
    const sourcePath = resolve(this.workingDir, sourceFile);
    const destDirPath = resolve(this.workingDir, destinationDir);
    if (!(await checkExistence(destDirPath))) await mkdir(destDirPath);
    const destFilePath = resolve(destDirPath, basename(sourcePath));

    await access(sourcePath);

    const reader = createReadStream(sourcePath);
    const writer = createWriteStream(destFilePath);
    await pipeline(reader, writer);
  }

  async deleteFile([fileName]) {
    const fileToDelete = resolve(this.workingDir, fileName);
    await deleteFile(fileToDelete);
  }

  async moveFile([sourceFile, targetDir]) {
    await this.copyFile([sourceFile, targetDir]);
    await this.deleteFile([sourceFile]);
  }

  osInfo([param]) {
    systemInfoSwitch(param);
  }

  async calculateHash([filePath]) {
    const file = resolve(this.workingDir, filePath);
    const data = await readFile(file);
    const hashSum = createHash('sha256').update(data).digest('hex');
    console.log(hashSum);
  }

  async compressFile(args) {
    if (args.length < 2 || !args[0] || !args[1]) {
      showError();
      return;
    }

    const [source, target] = args;
    const srcPath = resolve(this.workingDir, source);
    const destPath = resolve(this.workingDir, target);
    const validExtensions = ['.gz', '.br'];
    const targetExtension = extname(target);

    if (!validExtensions.includes(targetExtension)) {
      showInvalidInput();
      console.log('Extname for compressed file should be .gz or .br');
      return;
    }

    try {
      await compressDecompress(srcPath, destPath, 'compress');
    } catch (error) {
      showError();
    }
  }

  async decompressFile(args) {
    if (args.length < 2 || !args[0] || !args[1]) {
      showError();
      return;
    }

    const source = args[0];
    const target = args[1];
    const srcPath = resolve(this.workingDir, source);
    const destPath = resolve(this.workingDir, target);
    const targetExtension = extname(destPath);

    if (!targetExtension) {
      showInvalidInput();
      console.log('Destination file must have an extension.');
      return;
    }

    try {
      await compressDecompress(srcPath, destPath, 'decompress');
    } catch (error) {
      showError();
    }
  }

  ['.exit']() {
    process.exit();
  }

  async init() {
    showCurrentDirectory(this.workingDir);
    consoleInterface.prompt();
    consoleInterface.on('line', async (line) => {
      const input = line.trim().split(' ');
      const command = input[0];
      const args = input.slice(1);

      if (command === '.exit') {
        this['.exit']();
        return;
      }

      const methodName = commandMap[command];

      if (methodName && typeof this[methodName] === 'function') {
        try {
          await this[methodName](args);
          showCurrentDirectory(this.workingDir);
        } catch (error) {
          showError();
          console.log(error.message);
        }
      } else {
        showInvalidInput();
      }

      consoleInterface.prompt();
    });
  }
}
