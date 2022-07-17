const {
  split,
  equals,
  pipe,
  range,
  includes,
  map,
  keys,
  find,
  prop,
  __,
  sort,
  replace,
  splitEvery,
  join,
} = require("ramda");
const { readDb, writeDb } = require("./db");

const isExactNumber = (key) => split("-")(key).length === 1;

const toTitle = (camelCase) => {
  const result = camelCase.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const compareKey = (num) => (key) => {
  if (isExactNumber(key)) {
    return equals(Number(key), num);
  }

  return pipe(
    split("-"),
    map(Number),
    ([min, max]) => range(min, max + 1),
    includes(num)
  )(key);
};

const getTableResult = (num) => (table) =>
  pipe(keys, find(compareKey(num)), prop(__, table))(table);

const randomInteger = ({ max }) => Math.floor(Math.random() * max) + 1;

const rollDice = async (diceNames = ["action", "challengeA", "challengeB"]) => {
  const data = await readDb();
  diceNames.forEach((name) => {
    data.dice[name] =
      name === "action"
        ? randomInteger({ max: 6 })
        : randomInteger({ max: 10 });
  });
  await writeDb(data);
};

const getDiceResults = async ({ bonus = 0, value }) => {
  const data = await readDb();
  const challengeA = data.dice.challengeA;
  const challengeB = data.dice.challengeB;
  const challengeDice = sort((a, b) => a - b, [challengeA, challengeB]);

  let action = value ?? data.dice.action;
  let result = "miss";

  if (action + bonus > challengeDice[0]) {
    result = "weak hit";
  }

  if (action + bonus > challengeDice[1]) {
    result = "strong hit";
  }

  return {
    challengeA,
    challengeB,
    action,
    bonus,
    result,
  };
};

const printDiceResults = ({
  challengeA,
  challengeB,
  action,
  bonus = 0,
  result,
}) => {
  console.log("\nChallenge Die A: ", challengeA);
  console.log("Challenge Die B: ", challengeB);
  console.log("Total:", action + bonus, `(${action} + ${bonus})`);
  console.log(`\nResult: ${result.toUpperCase()}\n`);

  return { challengeA, challengeB, action, bonus, result };
};

function printProgress({ name, rank, progress }) {
  console.log(`${name} (${rank}) - ${progress / 4}/10 boxes.`);
}

function printAsset(asset) {
  const text = [
    asset.type,
    asset.name,
    ...asset.abilities.map(
      ({ acquired, text }) =>
        `${acquired ? "[x]" : "[ ]"} - ${pipe(
          split("\n"),
          map(pipe(split(" "), splitEvery(14), map(join(" ")), join("\n"))),
          join("\n"),
          replace(/\n/g, "\n\t")
        )(text)}`
    ),
  ].join("\n\n");
  console.log(`\n${text}\n`);
}

module.exports = {
  getTableResult,
  randomInteger,
  toTitle,
  rollDice,
  getDiceResults,
  printDiceResults,
  printProgress,
  printAsset,
};
