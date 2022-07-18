const prompts = require("prompts");
const { starforged } = require("dataforged");
const { marked } = require("marked");
const TerminalRenderer = require("marked-terminal");
const chalk = require("chalk");

marked.setOptions({
  renderer: new TerminalRenderer({
    strong: chalk.green.bold,
  }),
});

async function referenceAMove() {
  const { categoryIndex } = await prompts({
    type: "select",
    name: "categoryIndex",
    message: "Choose a category.",
    choices: starforged["Move Categories"].map((category) => category.Name),
  });

  const { moveIndex } = await prompts({
    type: "select",
    name: "moveIndex",
    message: "Choose a move.",
    choices: starforged["Move Categories"][categoryIndex].Moves.map(
      (move) => move.Name
    ),
  });

  console.log(
    marked(starforged["Move Categories"][categoryIndex].Moves[moveIndex].Text)
  );
}

module.exports = { referenceAMove };
