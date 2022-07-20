const prompts = require("prompts");
const { readDb, writeDb } = require("../db");
const { setMomenum } = require("../setters");
const { toTitle } = require("../utils");
const {
  selectAssetFromList,
  chooseAsset,
  selectCharacterAsset,
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
    allPaths.filter(compose(not, eqProps("Name", firstPath)))
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

  await setMomenum(amount);

  console.log(`Your momentum is now ${amount}.`);
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

async function manageCharacter() {
  const commands = {
    createCharacter,
    updateMomentum,
    viewStats,
    viewMeters,
    viewAbilities,
  };

  const { command } = await prompts({
    type: "autocomplete",
    name: "command",
    message: "Choose a command.",
    choices: Object.keys(commands).map((key) => ({
      title: toTitle(key),
      value: key,
    })),
  });

  await commands[command]();
}

module.exports = { manageCharacter };
