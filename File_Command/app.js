const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");

const CREATE = "create";

const commands = {
  [CREATE]: CREATE,
};

(async () => {
  const fileHandler = await fs.open("./command.txt", "r");
  const watcher = fs.watch("./command.txt");

  const createFile = async (name) => {
    try {
      await fs.open(name, "r");
    } catch (error) {
      const fileHandler = await fs.open(name, "w");
      console.log("created a file");
      fileHandler.close();
    }
  };

  fileHandler.on("change", async () => {
    const file_data = await fileHandler.stat();
    const { size } = file_data;
    const position = 0;
    const offset = position;
    const file_buffer = Buffer.alloc(size);
    const { byteLength } = file_buffer;

    await fileHandler.read(file_buffer, offset, byteLength, position);

    const command_line = file_buffer.toString("utf-8");

    if (command_line.includes(commands.create)) {
      try {
        const nameStarts = commands.create.length + 1;
        const file_name = command_line.slice(nameStarts);
        createFile(file_name);
      } catch (error) {
        console.log(error);
      }
    }
  });

  for await (const event of watcher) {
    if (event.eventType === "change") fileHandler.emit("change");
  }
})();
