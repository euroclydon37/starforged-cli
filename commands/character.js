const prompts = require("prompts");
const fs = require("fs/promises");
const Assets = require("../assets.json");
const { dbPath } = require("../constants");
const { readDb, writeDb } = require("../db");

const makeCharacter = ({ name, edge, heart, iron, shadow, wits, assets }) => ({
  name,
  stats: {
    edge,
    heart,
    iron,
    shadow,
    wits,
  },
  meters: {
    health: 5,
    spirit: 5,
    supply: 5,
    momentum: 2,
    momentum_reset: 2,
    max_momentum: 10,
  },
  items: [],
  assets,
});

async function createCharacter() {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "What name would you like?",
  });

  const firstPath = await prompts({
    type: "select",
    name: "name",
    message: "Choose your first path.",
    choices: Assets.filter(({ type }) => type === "PATH").map(({ name }) => ({
      title: name,
      value: name,
    })),
  });

  const secondPath = await prompts({
    type: "select",
    name: "name",
    message: "Choose your second path.",
    choices: Assets.filter(
      ({ type, name }) => type === "PATH" && name !== firstPath.name
    ).map(({ name }) => ({ title: name, value: name })),
  });

  const finalAsset = await prompts({
    type: "select",
    name: "name",
    message: "Choose your final asset.",
    choices: Assets.filter(
      ({ type, name }) =>
        type !== "DEED" &&
        name !== firstPath.name &&
        name !== secondPath.name &&
        name !== "STARSHIP"
    ).map(({ name }) => ({ title: name, value: name })),
  });

  const getAssetByName = (name) => Assets.find((a) => a.name === name);

  const assets = [
    Assets[0],
    getAssetByName(firstPath.name),
    getAssetByName(secondPath.name),
    getAssetByName(finalAsset.name),
  ];

  const characterStats = {
    edge: undefined,
    heart: undefined,
    iron: undefined,
    shadow: undefined,
    wits: undefined,
  };

  const getUnassignedStats = () =>
    Object.keys(characterStats).filter(
      (key) => characterStats[key] === undefined
    );

  const statValues = [3, 2, 2, 1, 1];

  while (getUnassignedStats().length > 0) {
    const value = statValues.shift();
    const { key } = await prompts({
      type: "select",
      name: "key",
      message: `Which stat should have be ${value}?`,
      choices: getUnassignedStats().map((statName) => ({
        title: statName,
        value: statName,
      })),
    });

    characterStats[key] = value;
  }

  const data = await readDb();

  data.character = makeCharacter({ name, ...characterStats, assets });

  await writeDb(data);
  console.log(`Created character named ${name}`);
}

module.exports = { createCharacter };
