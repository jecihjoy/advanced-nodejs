const { createReadStream, createWriteStream, read } = require("fs");

const readStream = createReadStream("powder-day.mp4");
const writeStream = createWriteStream("powder-day-copy.mp4", {
  highWaterMark: 12345678,
});

/** Reading data chunk by chunk */
readStream.on("data", (chunk) => {
  /** Writing data chunk by chunk */
  const result = writeStream.write(chunk);
  if (!result) {
    console.log("BackPressure");
    readStream.pause();
  }
});

readStream.on("error", (error) => {
  console.log("an error has occurred.");
  console.error(error);
});

readStream.on("end", () => {
  writeStream.end();
  console.log("Read stream finished");
});

writeStream.on("drain", () => {
  console.log("Write stream drained");
  readStream.resume();
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

/** Replacing stream read and write listeners with pipe */
readStream
  .pipe(createWriteStream("powder-day-copy1.mp4"))
  .on("error", console.error);

  /** echo $JAVA_HOME | node file-streams.js (using unix pipe) */
process.stdin.pipe(createWriteStream('test.txt'));