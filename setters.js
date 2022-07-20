const { progressIncrements } = require("./constants");
const { readDb, writeDb } = require("./db");
const { printProgress } = require("./utils");

async function createNewVow({ name, rank }) {
  const data = await readDb();

  if (!data.vows) {
    data.vows = {};
  }

  if (data.vows[name]) {
    throw new Error("That vow already exists.");
  }

  const vow = {
    name,
    rank,
    progress: 0,
  };

  data.vows[name] = vow;

  await writeDb(data);
  printProgress(vow);
}

async function deleteVow({ name }) {
  const data = await readDb();
  delete data.vows[name];
  await writeDb(data);
}

async function markProgressOnVow({ name, rank }) {
  const data = await readDb();
  const newProgressValue = Math.min(
    data.vows[name].progress + progressIncrements[rank],
    40
  );
  data.vows[name].progress = newProgressValue;
  await writeDb(data);
  printProgress(data.vows[name]);
}

async function loseProgressOnVow({ name, boxes = 0 }) {
  const data = await readDb();
  const newProgressValue = data.vows[name].progress - boxes * 4;
  data.vows[name].progress = newProgressValue;
  await writeDb(data);
  printProgress(data.vows[name]);
}

async function markProgressOnConnection({ name, rank }) {
  const data = await readDb();
  const newProgressValue = Math.min(
    data.npcs[name].progress + progressIncrements[rank],
    40
  );
  data.npcs[name].progress = newProgressValue;
  await writeDb(data);
  printProgress(data.npcs[name]);
}

async function loseConnection({ name }) {
  const data = await readDb();
  data.npcs[name].relationship_broken = true;
  await writeDb(data);
  console.log(`Your connection to ${name} has been lost.`);
}

async function setMomenum(value = 0) {
  const data = await readDb();
  data.character.meters.momentum = value;
  await writeDb(data);
}

async function addLoreEntry(name, firstFact) {
  const data = await readDb();

  if (!data.lore) {
    data.lore = {};
  }

  if (data.lore[name]) {
    throw new Error("That lore entry already exists.");
  }

  data.lore[name] = {
    name,
    facts: [firstFact],
    related_entries: [],
  };
  await writeDb(data);
}

async function insertRelatedEntry(name, relatedName) {
  const data = await readDb();
  data.lore[name].related_entries.push(relatedName);
  await writeDb(data);
}

async function insertFact(entryName, fact = "") {
  if (!fact) throw new Error("New fact not provided.");
  const data = await readDb();
  data.lore[entryName].facts.push(fact);
  await writeDb(data);
}

module.exports = {
  createNewVow,
  deleteVow,
  markProgressOnVow,
  loseProgressOnVow,
  markProgressOnConnection,
  loseConnection,
  setMomenum,
  addLoreEntry,
  insertRelatedEntry,
  insertFact,
};
