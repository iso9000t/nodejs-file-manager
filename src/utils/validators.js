import { stat } from 'node:fs/promises';

export async function checkExistence(path, type = 'dir') {
  try {
    const stats = await stat(path);
    if (type === 'dir') {
      return stats.isDirectory();
    } else {
      return stats.isFile();
    }
  } catch {
    return false;
  }
}
