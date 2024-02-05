import { FileManagerApp } from './app.js';
import { homedir } from 'node:os';
import welcomeUser from './utils/welcome.js';

welcomeUser();

const fileManager = new FileManagerApp(homedir());
await fileManager.init();
