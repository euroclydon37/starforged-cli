const prompts = require("prompts");
const { sort } = require("ramda");
const { readDb } = require("../db");
const { randomInteger } = require("../utils");

async function act() {
  const { character } = await readDb();

  const stat = await prompts({
    type: "select",
    name: "name",
    message: "Which stat?",
    choices: Object.keys(character.stats).map((stat) => ({
      title: stat,
      value: stat,
    })),
  });

  const challengeDice = sort(
    (a, b) => a - b,
    [randomInteger({ max: 10 }), randomInteger({ max: 10 })]
  );

  const actionDie = randomInteger({ max: 6 });

  let result = "miss";
  const statValue = character.stats[stat.name];

  if (actionDie + statValue > challengeDice[0]) {
    result = "weak hit";
  }

  if (actionDie + statValue > challengeDice[1]) {
    result = "strong hit";
  }

  console.log(`\nRolling plus: ${stat.name}`);
  console.log("\nChallenge Dice: ", ...challengeDice);
  console.log(
    "\nResult:",
    actionDie + statValue,
    `(Action Die + ${stat.name})`
  );
  console.log(`\n${result}\n`);
}

module.exports = { act };
