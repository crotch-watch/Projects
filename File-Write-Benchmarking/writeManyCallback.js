const fs = require("node:fs");

(async () => {
  fs.open("text.txt", "w", 0o666, (error, fd) => {
    const MAX_ITERATIONS = 1_000_000;
    console.time("timer");
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      fs.writeSync(fd, iter.toString());
    }
    console.timeEnd("timer");
    fs.close(fd);
  });
})();
