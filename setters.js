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

async function increaseMomentum(amount = 0) {
  const data = await readDb();
  const maxMomentum = data.character.meters.max_momentum;
  data.character.meters.momentum = Math.min(
    data.character.meters.momentum + amount,
    maxMomentum
  );
}

module.exports = {
  createNewVow,
  deleteVow,
  markProgressOnVow,
  loseProgressOnVow,
  markProgressOnConnection,
  loseConnection,
  increaseMomentum,
};
