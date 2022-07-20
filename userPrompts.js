const prompts = require("prompts");
const { readDb } = require("./db");
const { prop, isEmpty } = require("ramda");
const { randomInteger, toTitle } = require("./utils");
const { starforged } = require("dataforged");

async function getPropByPrompt({
  message,
  keyValueMap,
  map = (key, value) => value,
}) {
  const { key } = await prompts({
    type: "autocomplete",
    name: "key",
    message,
    choices: Object.keys(keyValueMap).map((key) => ({
      title: toTitle(key),
      value: key,
    })),
  });

  return map(key, keyValueMap[key]);
}

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
  return getPropByPrompt({
    message: "Which stat?",
    keyValueMap: data.character.stats,
    map: (key, value) => ({ name: key, value }),
  });
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
  return getPropByPrompt({
    message: "Which NPC?",
    keyValueMap: data.npcs,
  });
}

async function selectVow() {
  const data = await readDb();
  if (isEmpty(data.vows)) return;
  return getPropByPrompt({
    message: "Which Vow?",
    keyValueMap: data.vows,
  });
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
  getPropByPrompt,
  autocompletePromptByIndex,
  selectCharacterStat,
  selectCharacterAsset,
  selectNpc,
  selectVow,
  chooseOracle,
  selectAssetFromList,
  chooseAsset,
};
