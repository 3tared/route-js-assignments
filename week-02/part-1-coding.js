const path = require("path");
const fs = require("fs");
const os = require("os");
const EventEmitter = require("events");

// 1. Write a function that logs the current file path and directory.
// function logCurrentPath() {
//   const filePath = __filename;
//   const dirPath = __dirname;
//   console.log({ File: filePath, Dir: dirPath });
// }
// logCurrentPath();

// 2. Write a function that takes a file path and returns its file name.
// function getFileName(filePath) {
//   return path.basename(filePath);
// }
// console.log(getFileName(__filename));

// 3. Write a function that builds a path from an object.
// function buildPath(pathObj) {
//   return path.format(pathObj);
// }

// 4. Write a function that returns the file extension from a given file path.
// function getFileExtension(filePath) {
//   return path.extname(filePath);
// }

// 5. Write a function that parses a given path and returns its name and ext.
// function parsePath(filePath) {
//   const parsed = path.parse(filePath);
//   return { Name: parsed.name, Ext: parsed.ext };
// }

// 6. Write a function that checks whether a given path is absolute.
// function isAbsolutePath(filePath) {
//   return path.isAbsolute(filePath);
// }

// 7. Write a function that joins multiple segments
// function joinSegments(...segments) {
//   return path.join(...segments);
// }

// 8. Write a function that resolves a relative path to an absolute one.
// function resolveToAbsolute(relativePath) {
//   return path.resolve(relativePath);
// }

// 9. Write a function that joins two paths.
// function joinTwoPaths(path1, path2) {
//   return path.join(path1, path2);
// }

// 10. Write a function that deletes a file asynchronously.
// function deleteFileAsync(filePath) {
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.log(`Error deleting file: ${err.message}`);
//     } else {
//       const fileName = path.basename(filePath);
//       console.log(`The ${fileName} is deleted.`);
//     }
//   });
// }

// 11. Write a function that creates a folder synchronously.
// function createFolderSync(folderPath) {
//   try {
//     fs.mkdirSync(folderPath, { recursive: true });
//     console.log("Success");
//   } catch (err) {
//     console.log(`Error: ${err.message}`);
//   }
// }

// 12. Create an event emitter that listens for a "start" event and logs a welcome message.
// const emitter = new EventEmitter();

// function setupStartEvent() {
//   emitter.on("start", () => {
//     console.log("Welcome event triggered!");
//   });
// }
// emitter.emit("start");

// 13. Emit a custom "login" event with a username parameter.
// function setupLoginEvent() {
//   emitter.on("login", (username) => {
//     console.log(`User logged in: ${username}`);
//   });
// }

// emitter.emit('login', 'Ahmed');

// 14. Read a file synchronously and log its contents.
// function readFileSync(filePath) {
//   try {
//     const content = fs.readFileSync(filePath, "utf8");
//     console.log(content);
//   } catch (err) {
//     console.log(`Error reading file: ${err.message}`);
//   }
// }

// 15. Write asynchronously to a file.
// function writeFileAsync(filePath, content) {
//   fs.writeFile(filePath, content, "utf8", (err) => {
//     if (err) {
//       console.log(`Error writing file: ${err.message}`);
//     } else {
//       console.log("File written successfully");
//     }
//   });
// }

// 16. Check if a directory exists.
// function checkDirectoryExists(dirPath) {
//   return fs.existsSync(dirPath);
// }

// 17. Write a function that returns the OS platform and CPU architecture.
// function getSystemInfo() {
//   return {
//     Platform: os.platform(),
//     Arch: os.arch(),
//   };
// }
