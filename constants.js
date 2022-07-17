const os = require("os");
const path = require("path");

const appPath = path.resolve(os.homedir(), "starforged-cli");
const dbPath = path.resolve(appPath, "db.json");

const ranks = ["troublesome", "dangerous", "formidable", "extreme", "epic"];

const progressIncrements = {
  troublesome: 12,
  dangerous: 8,
  formidable: 4,
  extreme: 2,
  epic: 1,
};

module.exports = { appPath, dbPath, ranks, progressIncrements };
