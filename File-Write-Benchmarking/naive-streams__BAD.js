const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");

const MAX_ITERATIONS = 1_000_000;

(async () => {
  const fileHandler = await fs.open("text.txt", "w");
  const writeStream = fileHandler.createWriteStream();
  console.time("timer");
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    writeStream.write(Buffer.from(` ${iter} `));
  }
  console.timeEnd("timer");
  await fileHandler.close();
})();
