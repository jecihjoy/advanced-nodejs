var fs = require("fs");
var util = require("util");

var delay = (seconds, callback) => {
  if (seconds > 3) {
    callback(new Error(`${seconds} seconds it too long!`));
  } else {
    setTimeout(
      () => callback(null, `The ${seconds} second delay is over.`),
      seconds
    );
  }
};

/* Using callbacks */
delay(1, (error, message) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log(message);
  }
});

/** Using util promisify function to convert a callback to a promise */
var promiseDelay = util.promisify(delay);
promiseDelay(1)
  .then(console.log)
  .catch((err) => {
    console.log(err.message);
  });

/** Write and read file, promisify */
var writeFile = util.promisify(fs.writeFile);
var readFile = util.promisify(fs.readFile);
var unlink = util.promisify(fs.unlink);
var beep = () => process.stdout.write("\x07");

writeFile("test.txt", "Writing to a text file", "utf8")
  .then(() => console.log("File successfully written"))
  .then(beep)
  .catch((err) => console.log(`Error while writing to file ${err}`));

readFile("test.txt", "utf8")
  .then((d) => console.log(`READ: ${d}`))
  .then(() => unlink("test.txt"))
  .then(beep)
  .then(() => "Unlinked successfully")
  .then(console.log)
  .catch((err) => console.log("ERROR: ", err));
