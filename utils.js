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
} = require("ramda");
const { readDb, writeDb } = require("./db");

const isExactNumber = (key) => split("-")(key).length === 1;

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

const rollDice = async (diceNames = []) => {
  const data = await readDb();
  diceNames.forEach((name) => {
    data.dice[name] =
      name === "d100"
        ? randomInteger({ max: 100 })
        : name === "action"
        ? randomInteger({ max: 6 })
        : randomInteger({ max: 10 });
  });
  await writeDb(data);
};

const getDiceResults = ({ bonus = 0, action, challengeA, challengeB }) => {
  const challengeDice = sort((a, b) => a - b, [challengeA, challengeB]);

  console.log({ bonus, action, challengeA, challengeB });

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

module.exports = {
  getTableResult,
  randomInteger,
  rollDice,
  getDiceResults,
  printDiceResults,
};
