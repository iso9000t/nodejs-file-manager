# nodejs-file-manager

## File Manager CLI Commands
Welcome to the File Manager! This tool lets you navigate the file system, manage files, 
and retrieve system information via a command-line interface.

### Starting the Program
- Launch with: `npm run start -- --username=your_username`
- Exit with `CTRL + C` or type `.exit`

### Navigation Commands
- `up`: Move up one directory level.
- `cd <path>`: Change the current directory to `<path>`.
- `ls`: List files and directories in the current directory.

### File Operations
- `cat <file>`: Display contents of `<file>`.
- `add <file>`: Create an empty file named `<file>`.
- `rn <old> <new>`: Rename file from `<old>` to `<new>`.
- `cp <file> <dir>`: Copy `<file>` to `<dir>`.
- `mv <file> <dir>`: Move `<file>` to `<dir>`.
- `rm <file>`: Delete `<file>`.

### System Info Commands
- `os --EOL`: Print the system's End-Of-Line character.
- `os --cpus`: Display CPU information.
- `os --homedir`: Show the current user's home directory.
- `os --username`: Get the current system username.
- `os --architecture`: Show CPU architecture.

### Hash and Compression
- `hash <file>`: Calculate and display the SHA256 hash of `<file>`.
- `compress <source> <destination>`: Compress `<source>` file to `<destination>` using Brotli. Ensure to specify the file extension for the destination.
- `decompress <source> <destination>`: Decompress `<source>` file to `<destination>`. The destination file must include the appropriate extension.

Ensure you replace `<path>`, `<file>`, `<old>`, `<new>`, `<dir>`, `<source>`, and `<destination>` with your actual paths or filenames. 
For compression operations, specifying the file extension for the destination file is required to determine the correct format.
