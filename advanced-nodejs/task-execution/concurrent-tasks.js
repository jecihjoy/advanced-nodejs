/** Allows combining both sequential and parallel execution using a task queue*/

const logUpdate = require("log-update");
const toX = () => "X";
var delay = (seconds) =>
  new Promise((resolves) => {
    setTimeout(resolves, seconds * 1000);
  });

var tasks = [
  delay(4),
  delay(6),
  delay(4),
  delay(3),
  delay(5),
  delay(7),
  delay(9),
  delay(10),
  delay(3),
  delay(5),
];

class PromiseQueue {
  constructor(promises = [], taskCount = 1) {
    this.concurrentTasks = taskCount;
    this.total = promises.length;
    this.todo = promises;
    this.runningTasks = [];
    this.completedTasks = [];
  }

  get runAnother() {
    return this.runningTasks.length < this.concurrentTasks && this.todo.length;
  }

  run() {
    while (this.runAnother) {
      let promise = this.todo.shift();
      promise.then(() => {
        this.completedTasks.push(this.runningTasks.shift());
        this.graphTasks();
        this.run();
      });
      this.runningTasks.push(promise);
      this.graphTasks();
    }
  }

  graphTasks() {
    var { todo, runningTasks, completedTasks } = this;
    logUpdate(`

   todo: [${todo.map(toX)}]
   running: [${runningTasks.map(toX)}]
   complete: [${completedTasks.map(toX)}]

    `);
  }
}

var delayQueue = new PromiseQueue(tasks, 2);
delayQueue.run();