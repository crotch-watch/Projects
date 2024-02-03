const fs = require("node:fs");
const { Buffer } = require("node:buffer");

const MAX_ITERATIONS = 1_000_000;
const MAX_BATCH = 10_000;

(async () => {
  fs.open("text.txt", "w", (error, fd) => {
    const buffer = Buffer.alloc(MAX_BATCH);

    console.time("timer");
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const remainder = iter % MAX_BATCH;
      if (remainder === 0) fs.writeFileSync(fd, buffer);
      buffer[remainder] = 0x31;
    }
    console.timeEnd("timer");
    fs.close(fd);
  });
})();
