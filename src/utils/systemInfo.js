import { EOL, cpus, homedir, userInfo, arch } from 'node:os';
import { showInvalidInput } from './alertMessages.js';

 export const systemInfoSwitch = (option) => {
  const optionsMap = {
    '--EOL': () => console.log(JSON.stringify(EOL)),
    '--cpus': () => {
      const cpuInfo = cpus().map((cpu) => ({
        model: cpu.model.trim(),
        'Clock rate': `${(cpu.speed / 1000).toFixed(1)} GHz`,
      }));
      console.log(`CPU count: ${cpuInfo.length}`);
      console.table(cpuInfo);
    },
    '--homedir': () => console.log(homedir()),
    '--username': () => console.log(userInfo().username),
    '--architecture': () => console.log(arch()),
  };

  if (optionsMap[option]) {
    optionsMap[option]();
  } else {
    showInvalidInput();
  }
};
