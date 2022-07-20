const { readDb } = require("./db");

async function getCharacterStat(statName) {
  const data = await readDb();

  return {
    name: statName,
    value: data.character.stats[statName],
  };
}

async function getNpc(name) {
  const data = await readDb();
  return data.npcs[name];
}

async function getLoreEntry(name) {
  const data = await readDb();
  return data.lore[name];
}

module.exports = { getLoreEntry };
