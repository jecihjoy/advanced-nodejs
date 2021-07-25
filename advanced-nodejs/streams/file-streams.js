const { createReadStream, createWriteStream } = require("fs");

const readStream = createReadStream("powder-day.mp4");
const writeStream = createWriteStream("powder-day-copy.mp4");

/** Reading data chunk by chunk */
readStream.on("data", (chunk) => {
  /** Writing data chunk by chunk */
  writeStream.write(chunk);
});

readStream.on("end", () => {
  writeStream.end();
  console.log("Read stream finished");
});

readStream.on("error", (error) => {
  console.log("an error has occurred.");
  console.error(error);
});

// readStream.pause();
process.stdin.on("data", (chunk) => {
  if (chunk.toString().trim() === "finish") {
    readStream.resume();
  }
  readStream.read();
});

writeStream.on("close", () => {
  process.stdout.write("File copied successfully");
});
