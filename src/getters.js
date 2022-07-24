const { readDb } = require("./db");

async function getLoreEntry(name) {
  const data = await readDb();
  return data.lore[name];
}

module.exports = { getLoreEntry };
