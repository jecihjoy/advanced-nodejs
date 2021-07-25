/** CHAINED CALLBACKS */
var fs = require("fs");
var beep = () => process.stdout.write("\x07");

const doStuffSequentially = () => {
  console.log("starting");
  setTimeout(() => {
    console.log("waiting");
    setTimeout(() => {
      console.log("waiting some more");
      fs.writeFile("file.txt", "Sample File...", (error) => {
        if (error) {
          console.error(error);
        } else {
          beep();
          console.log("file.txt created");
          setTimeout(() => {
            beep();
            fs.unlink("file.txt", (error) => {
              if (error) {
                console.error(error);
              } else {
                console.log("file.txt removed");
                console.log("sequential execution complete");
              }
            });
          }, 3000);
        }
      });
    }, 2000);
  }, 1000);
};

doStuffSequentially();

/** PROMISIFY AND THEN FUNCTIONS */
var { promisify } = require("util");
var writeFile = promisify(fs.writeFile);
var unlink = promisify(fs.unlink);
var delay = (seconds) =>
  new Promise((resolves) => {
    setTimeout(resolves, seconds * 1000);
  });

const doStuffSequentially2 = () =>
  Promise.resolve()
    .then(() => console.log("USING PROMISIFY starting"))
    .then(() => delay(1))
    .then(() => "waiting")
    .then(console.log)
    .then(() => delay(2))
    .then(() => writeFile("file.txt", "Sample File..."))
    .then(beep)
    .then(() => "file.txt created")
    .then(console.log)
    .then(() => delay(3))
    .then(() => unlink("file.txt"))
    .then(beep)
    .then(() => "file.txt removed")
    .then(console.log)
    .catch(console.error);

doStuffSequentially2()
  .then(() => console.log("again again!!!"))
  .then(() => doStuffSequentially())
  .then(() => console.log("enough already..."));

/** PROMISIFY AND THEN FUNCTIONS */
var { promisify } = require("util");
var writeFile = promisify(fs.writeFile);
var unlink = promisify(fs.unlink);
var delay = (seconds) =>
  new Promise((resolves) => {
    setTimeout(resolves, seconds * 1000);
  });

/** ASYNC AWAIT */
const doStuffSequentially3 = async () => {
  console.log("USING ASYNC AWAIT starting");
  await delay(1);
  console.log("waiting");
  await delay(2);
  await writeFile("file.txt", "Sample File...");
  beep();
  console.log("file.txt created");
  await delay(3);
  await unlink("file.txt");
  beep();
  console.log("file.txt removed");
  //   return Promise.resolve();
};

doStuffSequentially3();
