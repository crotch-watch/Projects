const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");

const MAX_ITERATIONS = 1_000_000;

(async () => {
  const fileHandler = await fs.open("text.txt", "w");
  const buffer = Buffer.alloc(1);
  buffer[0] = 0x31;
  console.time("timer");
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    await fileHandler.write(buffer);
  }
  console.timeEnd("timer");
  await fileHandler.close();
})();
