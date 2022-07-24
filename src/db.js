const fs = require("fs/promises");
const FS = require("fs");
const { dbPath, appPath } = require("./constants");

async function readDb() {
  try {
    await fs.access(appPath, FS.constants.F_OK);
  } catch (error) {
    await fs.mkdir(appPath);
  }

  try {
    await fs.access(dbPath, FS.constants.F_OK);
  } catch (error) {
    return {};
  }

  return require(dbPath);
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };
