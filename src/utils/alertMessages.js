export const welcomeMessage = (user) => {
  console.log(`Welcome to the File Manager, ${user}!`);
};

export const goodbyeMessage = (user) => {
  console.log(`Thank you for using File Manager, ${user}, goodbye!`);
};

export const showCurrentDirectory = (directory) => {
  console.log(`You are currently in ${directory}`);
};

export const showInvalidInput = () => {
  console.log('Invalid input.');
};

export const showError = () => {
  console.log('Operation failed.');
};
