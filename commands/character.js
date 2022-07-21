const prompts = require("prompts");
const { readDb, writeDb } = require("../db");
const {
  setMomentum,
  setMomentumReset,
  setMaxMomentum,
  setHealth,
  setSpirit,
  setSupply,
} = require("../setters");
const {
  selectAssetFromList,
  chooseAsset,
  selectCharacterAsset,
  getPropByPrompt,
} = require("../userPrompts");
const { starforged } = require("dataforged");
const {
  pipe,
  filter,
  prop,
  equals,
  last,
  eqProps,
  compose,
  not,
  map,
  join,
} = require("ramda");
const { getEnabledAbilities } = require("../selectors/assets.selectors");
const { marked } = require("marked");
const {
  getMomentum,
  getMomentumReset,
  getMaxMomentum,
  getHealth,
  getSpirit,
  getSupply,
  getCharacterAssets, getCharacter,
} = require("../selectors/character.selectors");

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
  legacy_tracks: {
    quests: 0,
    bonds: 0,
    discoveries: 0,
    xp: 0,
  },
  items: [],
  assets,
});

const nameIsNot =
  (name) =>
  ({ Name }) =>
    not(equals(name, Name));

async function createCharacter() {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "What name would you like?",
  });

  const allPaths = pipe(
    filter(pipe(prop("Name"), equals("Path"))),
    last,
    prop("Assets")
  )(starforged["Asset Types"]);

  const starship = starforged["Asset Types"][0].Assets[0];
  const firstPath = await selectAssetFromList(allPaths);
  const secondPath = await selectAssetFromList(
    allPaths.filter(nameIsNot(firstPath.Name))
  );
  const finalAsset = await chooseAsset();

  const assets = [starship, firstPath, secondPath, finalAsset];

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

async function updateMomentum() {
  const data = await readDb();
  const momentum = getMomentum(data);
  const reset = getMomentumReset(data);
  const max = getMaxMomentum(data);
  const { amount } = await prompts({
    type: "number",
    name: "amount",
    message: `Your momentum was ${momentum}. What would you like to set it to? (Reset ${reset}, Max ${max})`,
  });

  const newAmount = Math.min(amount, max);

  await setMomentum(newAmount);

  console.log(`Your momentum is now ${newAmount}.`);
}

async function updateMomentumReset() {
  const data = await readDb();
  const reset = getMomentumReset(data);
  const { amount } = await prompts({
    type: "number",
    name: "amount",
    message: `Your momentum reset was ${reset}. What would you like to set it to?`,
  });
  await setMomentumReset(amount);
  console.log(`Your momentum reset is now ${amount}.`);
}

async function updateMaxMomentum() {
  const data = await readDb();
  const max = getMaxMomentum(data);
  const { amount } = await prompts({
    type: "number",
    name: "amount",
    message: `Your max momentum was ${max}. What would you like to set it to?`,
  });
  await setMaxMomentum(amount);
  console.log(`Your max momentum is now ${amount}.`);
}

async function updateHealth() {
  const data = await readDb();
  const health = getHealth(data);
  const { amount } = await prompts({
    type: "number",
    name: "amount",
    message: `Your health was ${health}. What would you like to set it to?`,
  });
  await setHealth(amount);
  console.log(`Your health is now ${amount}.`);
}

async function updateSpirit() {
  const data = await readDb();
  const spirit = getSpirit(data);
  const { amount } = await prompts({
    type: "number",
    name: "amount",
    message: `Your spirit was ${spirit}. What would you like to set it to?`,
  });
  await setSpirit(amount);
  console.log(`Your spirit is now ${amount}.`);
}

async function updateSupply() {
  const data = await readDb();
  const supply = getSupply(data);
  const { amount } = await prompts({
    type: "number",
    name: "amount",
    message: `Your supply was ${supply}. What would you like to set it to?`,
  });
  await setSupply(amount);
  console.log(`Your supply is now ${amount}.`);
}

async function viewStats() {
  const data = await readDb();
  console.log(data.character.stats);
}

async function viewMeters() {
  const data = await readDb();
  console.log(data.character.meters);
}

async function viewAbilities() {
  const asset = await selectCharacterAsset();
  console.log(
    "\n",
    pipe(
      getEnabledAbilities,
      map(pipe(prop("Text"), (text) => `- ${text}`, marked)),
      join("")
    )(asset.Abilities)
  );
}

async function updateMeter() {
  const commands = {
    momentum: updateMomentum,
    health: updateHealth,
    spirit: updateSpirit,
    supply: updateSupply,
    maxMomentum: updateMaxMomentum,
    momentumReset: updateMomentumReset,
  };

  const command = await getPropByPrompt({
    message: "Which meter?",
    keyValueMap: commands,
  });

  await command();
}

async function addAsset() {
  const data = await readDb();
  const asset = await chooseAsset(
    getCharacterAssets(data).map(({ Name }) => Name)
  );
  getCharacter(data).assets.push(asset);
  await writeDb(data);
  console.log(`${asset.Name} was added.`)
}

async function manageCharacter() {
  const commands = {
    createCharacter,
    updateMeter,
    viewStats,
    viewMeters,
    viewAbilities,
    addAsset,
  };

  const command = await getPropByPrompt({
    message: "Choose a command.",
    keyValueMap: commands,
  });

  await command();
}

module.exports = { manageCharacter };
