const { readDb, writeDb } = require("./db");
const { printVow } = require("./utils");

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
  printVow(vow);
}

async function deleteVow({ name }) {
  const data = await readDb();
  delete data.vows[name];
  await writeDb(data);
}

async function markProgressOnVow({ name, rank }) {
  const progressIncrements = {
    troublesome: 12,
    dangerous: 8,
    formidable: 4,
    extreme: 2,
    epic: 1,
  };
  const data = await readDb();
  const newProgressValue = Math.min(
    data.vows[name].progress + progressIncrements[rank],
    40
  );
  data.vows[name].progress = newProgressValue;
  await writeDb(data);
  printVow(data.vows[name]);
}

async function loseProgressOnVow(name, boxes = 0) {
  const data = await readDb();
  const newProgressValue = data.vows[name].progress - boxes * 4;
  data.vows[name].progress = newProgressValue;
  await writeDb(data);
  printVow(data.vows[name]);
}

async function gainMomentum(amount = 0) {
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
  gainMomentum,
  loseProgressOnVow,
};
