const { readDb, writeDb } = require("./db");

const progressIncrements = {
  troublesome: 12,
  dangerous: 8,
  formidable: 4,
  extreme: 2,
  epic: 1,
};

async function markProgressOnVow({ name, rank }) {
  const data = await readDb();
  data.vows[name].progress = Math.min(
    data.vows[name].progress + progressIncrements[rank],
    40
  );
  await writeDb(data);
}

module.exports = { markProgressOnVow };
