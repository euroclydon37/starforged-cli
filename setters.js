const { readDb, writeDb } = require("./db");

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
  console.log(`${name} - ${newProgressValue / 4}/10 boxes.`);
}

async function gainMomentum(amount = 0) {
  const data = await readDb();
  const maxMomentum = data.character.meters.max_momentum;
  data.character.meters.momentum = Math.min(
    data.character.meters.momentum + amount,
    maxMomentum
  );
}

module.exports = { markProgressOnVow, gainMomentum };
