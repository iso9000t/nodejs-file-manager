import { welcomeMessage, goodbyeMessage } from './alertMessages.js';

export default () => {
  const defaultUser = 'Anonymous';
  const args = process.argv.slice(2);

  let username = defaultUser;
  const userArgIndex = args.findIndex((arg) => arg.startsWith('--username'));

  if (userArgIndex !== -1) {
    const userArg = args[userArgIndex];
    username = userArg.split('=')[1].trim();
  }

  welcomeMessage(username);

  process.on('exit', () => goodbyeMessage(username));
};
