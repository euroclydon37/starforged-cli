const prompts = require("prompts");
const { readDb } = require("./db");
const { prop, isEmpty, not } = require("ramda");
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

async function autocompleteMultiSelectPromptByIndex({ message, choices = [] }) {
  const { indexStrings } = await prompts({
    type: "autocompleteMultiselect",
    name: "indexStrings",
    message,
    choices: choices.map((title, index) => ({ title, value: String(index) })),
  });

  return indexStrings.map(Number);
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

async function getResultsFromOracles(oraclesAndCategories = []) {
  const indices = await autocompleteMultiSelectPromptByIndex({
    message: "Which table?",
    choices: oraclesAndCategories.map(prop("Name")),
  });

  const choices = indices.map((index) => oraclesAndCategories[index]);

  const results = [];

  for (const choice of choices) {
    const roll = randomInteger({ max: 100 });

    results.push({
      name: choice.Name,
      value:
        choice.Categories || choice.Oracles
          ? await getResultsFromOracles([
              ...(choice.Categories ?? []),
              ...(choice.Oracles ?? []),
            ])
          : choice.Table.find(
              ({ Floor, Ceiling }) => roll >= Floor && roll <= Ceiling
            ).Result,
    });
  }

  return results;
}

async function selectAssetFromList(assets = []) {
  const index = await autocompletePromptByIndex({
    message: "Pick an asset.",
    choices: assets.map(prop("Name")),
  });

  return assets[index];
}

async function chooseAsset(exclude = []) {
  const validCategoryOptions = starforged["Asset Types"].filter((category) =>
    category.Assets.some((asset) => not(exclude.includes(asset.Name)))
  );

  const typeIndex = await autocompletePromptByIndex({
    message: "Pick a category",
    choices: validCategoryOptions.map(prop("Name")),
  });

  const category = validCategoryOptions[typeIndex];
  return selectAssetFromList(
    category.Assets.filter((asset) => not(exclude.includes(asset.Name)))
  );
}

module.exports = {
  getPropByPrompt,
  autocompletePromptByIndex,
  selectCharacterStat,
  selectCharacterAsset,
  selectNpc,
  selectVow,
  getResultsFromOracles,
  selectAssetFromList,
  chooseAsset,
};
