const prompts = require("prompts");
const { readDb } = require("./db");

async function selectCharacterStat() {
  const data = await readDb();
  const { statName } = await prompts({
    type: "select",
    name: "statName",
    message: "Which stat?",
    choices: Object.keys(data.character.stats).map((key) => ({
      title: key,
      value: key,
    })),
  });

  return {
    name: statName,
    value: data.character.stats[statName],
  };
}

async function selectCharacterAsset() {
  const data = await readDb();
  const { index } = await prompts({
    type: "select",
    name: "index",
    message: "Which asset?",
    choices: data.character.assets.map((asset, index) => ({
      title: asset.name,
      value: index,
    })),
  });
  return data.character.assets[index];
}

module.exports = {
  selectCharacterStat,
  selectCharacterAsset,
};
