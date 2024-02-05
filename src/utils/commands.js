const commandMap = {
  up: 'goUp',
  ls: 'list',
  cat: 'viewFile',
  add: 'createFile',
  rn: 'renameFile',
  cp: 'copyFile',
  rm: 'deleteFile',
  mv: 'moveFile',
  os: 'osInfo',
  hash: 'calculateHash',
  compress: 'compressFile',
  decompress: 'decompressFile',
  cd: 'changeDir',
};

export default commandMap;