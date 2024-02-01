const fs = require("node:fs/promises");

const MAX_ITERATIONS = 1_000_000;

(async () => {
  const fileHandler = await fs.open("text.txt", "w");
  console.time("timer");
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    await fileHandler.write(iter.toString());
  }
  console.timeEnd("timer");
  fileHandler.close();
})();
