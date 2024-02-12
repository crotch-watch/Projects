const fs = require("node:fs");

const MAX_ITERATIONS = 25_000_000;

(async () => {
  fs.open("text.txt", "w", (error, fd) => {
    const writeStream = fs.createWriteStream("text.txt");
    let iterations = 0;
    console.time("timer");
    function write() {
      while (iterations < MAX_ITERATIONS) {
        iterations++;
        // on last iteration -> closing stream and extras
        if (iterations === MAX_ITERATIONS - 1) return writeStream.end(` ${iterations} `);

        // any iteration other than last write on buffer
        // write method returns false if next write is unsafe we break out of loop
        if (!writeStream.write(` ${iterations} `)) break;
      }
    }
    write();
    writeStream.on("drain", write);
    writeStream.on("finish", () => {
      console.timeEnd("timer");
      fs.close(fd);
    });
  });
})();
