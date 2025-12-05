// Part1: Core Modules
// const fs = require("fs");
// const zlib = require("zlib");
// const { pipeline } = require("stream");
// 1. Use a readable stream to read a file in chunks and log each chunk.
// function readFileInChunks(filePath) {
//   const readableStream = fs.createReadStream(filePath, { encoding: "utf8" });
//   let chunkNumber = 0;
//   readableStream.on("data", (chunk) => {
//     chunkNumber++;
//     console.log(`Chunk ${chunkNumber}`);
//     console.log(chunk);
//     console.log(`End of Chunk ${chunkNumber}`);
//   });
//   readableStream.on("end", () => {
//     console.log("Finished reading file");
//   });
//   readableStream.on("error", (error) => {
//     console.error("Error reading file:", error.message);
//   });
// }
// readFileInChunks("./big.txt");

// 2. Use readable and writable streams to copy content from one file to another.
// function copyFileUsingStreams(sourcePath, destPath) {
//   const readableStream = fs.createReadStream(sourcePath, { encoding: "utf8" });
//   const writableStream = fs.createWriteStream(destPath, { encoding: "utf8" });
//   readableStream.pipe(writableStream);
//   writableStream.on("finish", () => {
//     console.log("File copied using streams successfully!");
//   });
//   readableStream.on("error", (error) => {
//     console.error("Error reading source file:", error.message);
//   });
//   writableStream.on("error", (error) => {
//     console.error("Error writing to destination file:", error.message);
//   });
// }
// copyFileUsingStreams("./source.txt", "./dest.txt");

// 3. Create a pipeline that reads a file, compresses it, and writes it to another file.
// function compressFile(sourcePath, destPath) {
//   const readableStream = fs.createReadStream(sourcePath);
//   const gzip = zlib.createGzip();
//   const writableStream = fs.createWriteStream(destPath);
//   pipeline(readableStream, gzip, writableStream, (error) => {
//     if (error) {
//       console.error("Pipeline failed:", error.message);
//     } else {
//       console.log("File compressed successfully using pipeline!");
//       const originalSize = fs.statSync(sourcePath).size;
//       const compressedSize = fs.statSync(destPath).size;
//       console.log(`Original size: ${originalSize} bytes`);
//       console.log(`Compressed size: ${compressedSize} bytes`);
//     }
//   });
// }
// compressFile("./data.txt", "./data.txt.gz");
