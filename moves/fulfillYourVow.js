const prompts = require("prompts");
const { selectVow } = require("../userPrompts");
const { rollDice, printDiceResults, getDiceResults } = require("../utils");

async function fulfillYourVow() {
  const vow = await selectVow();

  const { shouldRoll } = await prompts({
    type: "select",
    name: "shouldRoll",
    message: "Roll the dice?",
    choices: [
      { title: "Yes", value: true },
      { title: "No", value: false },
    ],
  });

  if (shouldRoll) {
    await rollDice();
  }

  const { result } = printDiceResults(
    await getDiceResults({ value: Math.floor(vow.progress / 4) })
  );

  if (result === "strong hit") {
    console.log("Handle the strong hit");
  }

  if (result === "weak hit") {
    console.log("Handle the weak hit");
  }

  if (result === "miss") {
    console.log("handle the miss");
  }
}

module.exports = { fulfillYourVow };
