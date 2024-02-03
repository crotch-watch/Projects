const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");

const MAX_ITERATIONS = 1_000_000;
const MAX_BATCH = 10_000;

(async () => {
  const fileHandler = await fs.open("text.txt", "w");
  const buffer = Buffer.alloc(MAX_BATCH);

  console.time("timer");
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const remainder = iter % MAX_BATCH;
    if (remainder === 0) fileHandler.writeFile(buffer);
    buffer[remainder] = 0x31;
  }
  console.timeEnd("timer");

  await fileHandler.close();
})();
