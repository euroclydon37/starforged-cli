const { starforged } = require("dataforged");
const { marked } = require("marked");
const TerminalRenderer = require("marked-terminal");
const chalk = require("chalk");
const { autocompletePromptByIndex } = require("../userPrompts");
const { prop } = require("ramda");

marked.setOptions({
  renderer: new TerminalRenderer({
    strong: chalk.green.bold,
  }),
});

async function referenceAMove() {
  const categoryIndex = await autocompletePromptByIndex({
    message: "Choose a category.",
    choices: starforged["Move Categories"].map(prop("Name")),
  });

  const moveIndex = await autocompletePromptByIndex({
    message: "Choose a move.",
    choices: starforged["Move Categories"][categoryIndex].Moves.map(
      prop("Name")
    ),
  });

  const move = starforged["Move Categories"][categoryIndex].Moves[moveIndex];

  console.log(`\n${marked(`# ${move.Name}\n${move.Text}`)}`);
}

module.exports = { referenceAMove };
