const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");

(async () => {
  const fileHandler = await fs.open("./command.txt", "r");
  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      const file_data = await fileHandler.stat();

      const { size } = file_data;
      const position = 0;
      const offset = position;
      const file_buffer = Buffer.alloc(size);
      const { byteLength } = file_buffer;

      const { buffer: file } = await fileHandler.read(file_buffer, offset, byteLength, position);
      console.log(file);
      console.log(file.toString("utf-8"));
    }
  }
})();
