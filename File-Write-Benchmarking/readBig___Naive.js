const fs = require("node:fs/promises");

(async () => {
  const readfileHandle = await fs.open("text.txt", "r");
  const readStream = readfileHandle.createReadStream();
  const writeFileHandle = await fs.open("dest.txt", "w");
  const writeStream = writeFileHandle.createWriteStream();

  readStream.on("data", (chunk) => {
    writeStream.write(chunk);
    readStream.pause();
  });
  writeStream.on("drain", () => readStream.resume());
})();
