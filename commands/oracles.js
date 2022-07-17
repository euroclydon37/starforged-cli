const prompts = require("prompts");
const {
  keys,
  path,
  pipe,
  replace,
  map,
  compose,
  not,
  equals,
  head,
  split,
} = require("ramda");
const Tables = require("../oracles.json");
const { getTableResult, randomInteger } = require("../utils");

const isTable = pipe(
  keys,
  head,
  split("-"),
  head,
  Number,
  compose(not, equals(NaN))
);

const createChoice = (key) => ({
  title: replace("_", " ")(key),
  value: key,
});

async function selectKey(targetPath = []) {
  const result = await prompts({
    type: "select",
    name: "value",
    message: "Which table?",
    choices: pipe(path(targetPath), keys, map(createChoice))(Tables),
  });

  const nextPath = [...targetPath, result.value];
  const nestedValue = path(nextPath)(Tables);

  return isTable(nestedValue)
    ? getTableResult(randomInteger({ max: 100 }))(nestedValue)
    : Array.isArray(nestedValue)
    ? nestedValue[randomInteger({ max: nestedValue.length }) - 1]
    : await selectKey(nextPath);
}

async function runOracle() {
  console.log(await selectKey());
}

module.exports = { runOracle, isTable };
