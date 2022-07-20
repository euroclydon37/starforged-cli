const prompts = require("prompts");
const { readDb } = require("./db");
const { getCharacterStat } = require("./getters");
const { prop } = require("ramda");
const { randomInteger } = require("./utils");
const { starforged } = require("dataforged");

async function autocompletePromptByIndex({ message, choices = [] }) {
  const { indexString } = await prompts({
    type: "autocomplete",
    name: "indexString",
    message,
    choices: choices.map((title, index) => ({ title, value: String(index) })),
  });

  return Number(indexString);
}

async function selectCharacterStat() {
  const data = await readDb();
  const { statName } = await prompts({
    type: "autocomplete",
    name: "statName",
    message: "Which stat?",
    choices: Object.keys(data.character.stats).map((key) => ({
      title: key,
      value: key,
    })),
  });

  return await getCharacterStat(statName);
}

async function selectCharacterAsset() {
  const data = await readDb();
  const index = await autocompletePromptByIndex({
    message: "Which asset?",
    choices: data.character.assets.map(prop("Name")),
  });
  return data.character.assets[index];
}

async function selectNpc() {
  const data = await readDb();

  const { name } = await prompts({
    type: "autocomplete",
    name: "name",
    message: "Which NPC?",
    choices: Object.keys(data.npcs).map((name) => ({
      title: name,
      value: name,
    })),
  });

  return data.npcs[name];
}

async function selectVow() {
  const data = await readDb();

  const vowTitles = Object.keys(data.vows);

  if (!vowTitles.length) return;

  const { vowName } = await prompts({
    type: "autocomplete",
    name: "vowName",
    message: "Which Vow?",
    choices: Object.keys(data.vows).map((name) => ({
      title: name,
      value: name,
    })),
  });

  return data.vows[vowName];
}

async function chooseOracle(oraclesAndCategories = []) {
  const index = await autocompletePromptByIndex({
    message: "Which table?",
    choices: oraclesAndCategories.map(prop("Name")),
  });

  const choice = oraclesAndCategories[index];

  if (choice.Categories || choice.Oracles) {
    return chooseOracle([
      ...(choice.Categories ?? []),
      ...(choice.Oracles ?? []),
    ]);
  }

  const roll = randomInteger({ max: 100 });

  return choice.Table.find(
    ({ Floor, Ceiling }) => roll >= Floor && roll <= Ceiling
  ).Result;
}

async function selectAssetFromList(assets = []) {
  const index = await autocompletePromptByIndex({
    message: "Pick an asset.",
    choices: assets.map(prop("Name")),
  });

  console.log("Index is", index);

  return assets[index];
}

async function chooseAsset() {
  const typeIndex = await autocompletePromptByIndex({
    message: "Pick a category",
    choices: starforged["Asset Types"].map(prop("Name")),
  });

  const category = starforged["Asset Types"][typeIndex];
  return selectAssetFromList(category.Assets);
}

module.exports = {
  autocompletePromptByIndex,
  selectCharacterStat,
  selectCharacterAsset,
  selectNpc,
  selectVow,
  chooseOracle,
  selectAssetFromList,
  chooseAsset,
};
