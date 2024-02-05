import { access } from 'node:fs/promises';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export const compressDecompress = async (src, dest, mode = 'compress') => {
  await access(src);
  let operation;
  if (mode === 'compress') {
    operation = createBrotliCompress();
  } else if (mode === 'decompress') {
    operation = createBrotliDecompress();
  } else {
    throw new Error('Invalid mode specified. Use "compress" or "decompress".');
  }
  await pipeline(createReadStream(src), operation, createWriteStream(dest));
};
