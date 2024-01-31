const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");

const CREATE = "create";
const DELETE = "delete";
const RENAME = "rename";
const APPEND = "append";

const createFile = async (name) => {
  try {
    const existingFileHandle = await fs.open(name, "r");
    await existingFileHandle.close();
  } catch (error) {
    const fileHandler = await fs.open(name, "w");
    console.log(`created ${name}`);
    await fileHandler.close();
  }
};
const deleteFile = async (name) => {
  try {
    await fs.unlink(name);
    console.log("Deleted ", name);
  } catch ({ code }) {
    if (code === "ENOENT") console.log(`${name} doesn't exist`);
    else console.log("code: ", code);
  }
};
const renameFile = async (name, newName) => {
  try {
    await fs.rename(name, newName);
    console.log(`${name} has been renmaed to ${newName}`);
  } catch ({ code }) {
    if (code === "ENOENT") console.log(`${name} doesn't exist`);
    else console.log("code: ", code);
  }
};
const appendFile = async (name, data) => {
  let fileHandler;
  try {
    fileHandler = await fs.open(name, "a");
    await fileHandler.write(data);
    console.log("data has been appended to the file");
  } catch ({ code }) {
    if (code === "ENOENT") console.log(`${name} doesn't exist`);
    else console.log("code :", code);
  } finally {
    await fileHandler?.close();
  }
};

(async () => {
  const fileHandler = await fs.open("./command.txt", "r");

  fileHandler.on("change", async () => {
    const size = (await fileHandler.stat()).size;
    const buffer = Buffer.alloc(size);
    const offset = 0;
    const { byteLength: length } = buffer;
    const position = 0;

    await fileHandler.read(buffer, offset, length, position);
    const command_line = buffer.toString("utf-8");
    const [command, fileName] = command_line.split(" ", 2);

    const initOptionIndex = command.length + 1 + fileName.length + 1;
    const option = command_line.slice(initOptionIndex);

    if (command === CREATE) createFile(fileName);
    if (command === DELETE) deleteFile(fileName);
    if (command === RENAME) renameFile(fileName, option);
    if (command === APPEND) appendFile(fileName, option);
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") fileHandler.emit("change");
  }
})();
