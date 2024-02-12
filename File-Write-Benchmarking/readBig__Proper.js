const fs = require("node:fs/promises");

(async () => {
  const readfileHandle = await fs.open("text.txt", "r");
  const readStream = readfileHandle.createReadStream();
  const writeFileHandle = await fs.open("dest.txt", "w");
  const writeStream = writeFileHandle.createWriteStream();
  // WPC is the count of how many slices will a chunk require to not overflow the internal buffer
  const WRITES_PER_CHUNK = readStream.readableHighWaterMark / writeStream.writableHighWaterMark;
  let writes = 0;
  let sliceFrom = 0;
  let sliceTill = writeStream.writableHighWaterMark;
  let writableChunk;
  readStream.on("data", (chunk) => {
    // stream has been paused till chunk is written
    readStream.pause();
    write(chunk);
    writableChunk = chunk;
  });
  writeStream.on("drain", () => {
    // if writes are equal to WRITES_PER_CHUNK means all Buffer slices have been written to the disk
    if (writes === WRITES_PER_CHUNK) {
      writes = 0;
      sliceFrom = 0;
      sliceTill = writeStream.writableHighWaterMark;
      return readStream.resume();
    }
    write(writableChunk);
  });
  function write(chunk) {
    writeStream.write(chunk.slice(sliceFrom, sliceTill));
    writes++;
    sliceFrom = sliceTill;
    sliceTill = sliceFrom + writeStream.writableHighWaterMark;
  }
})();
