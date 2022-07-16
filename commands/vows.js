const prompts = require("prompts");
const { markProgressOnVow, loseProgressOnVow } = require("../setters");
const { selectVow } = require("../userPrompts");

async function markProgress() {
  const vow = await selectVow();
  await markProgressOnVow(vow);
}

async function loseProgress() {
  const vow = await selectVow();
  const { boxes } = await prompts({
    type: "number",
    name: "boxes",
    message: "How many boxes?",
  });
  await loseProgressOnVow(vow.name, boxes);
}

async function vows() {
  const commands = {
    markProgress,
    loseProgress,
  };

  const { command } = await prompts({
    type: "select",
    name: "command",
    message: "Choose a command.",
    choices: [
      { title: "Mark Progress", value: "markProgress" },
      { title: "Lose Progress", value: "loseProgress" },
    ],
  });

  await commands[command]();
}

module.exports = { vows };
