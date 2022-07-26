const prompts = require("prompts");
const { ranks } = require("../constants");
const {
  markProgressOnVow,
  loseProgressOnVow,
  createNewVow,
  deleteVow,
} = require("../setters");
const { selectVow } = require("../userPrompts");
const { printProgress } = require("../utils");

async function createVow() {
  const { name, rank } = await prompts([
    {
      type: "text",
      name: "name",
      message: "What do you vow to do?",
    },
    {
      type: "autocomplete",
      name: "rank",
      message: "What rank is it?",
      choices: ranks.map((value) => ({ title: value, value })),
    },
  ]);

  await createNewVow({ name, rank });
}

function printNoVowsError() {
  console.log("No vows have been sworn.");
}

async function abandonVow() {
  const vow = await selectVow();
  if (!vow) return printNoVowsError();
  await deleteVow({ name: vow.name });
}

async function markProgress() {
  const vow = await selectVow();
  if (!vow) return printNoVowsError();
  await markProgressOnVow(vow);
}

async function viewVow() {
  const vow = await selectVow();
  if (!vow) return printNoVowsError();
  printProgress(vow);
}

async function loseProgress() {
  const vow = await selectVow();
  if (!vow) return printNoVowsError();
  const { boxes } = await prompts({
    type: "number",
    name: "boxes",
    message: "How many boxes?",
  });
  await loseProgressOnVow({
    name: vow.name,
    boxes,
  });
}

async function vows() {
  const commands = {
    createVow,
    abandonVow,
    viewVow,
    markProgress,
    loseProgress,
  };

  const { command } = await prompts({
    type: "autocomplete",
    name: "command",
    message: "Choose a command.",
    choices: [
      { title: "Look at a Vow", value: "viewVow" },
      { title: "Swear a New Vow", value: "createVow" },
      { title: "Mark Progress", value: "markProgress" },
      { title: "Lose Progress", value: "loseProgress" },
      { title: "Abandon a Vow", value: "abandonVow" },
    ],
  });

  await commands[command]();
}

module.exports = { vows };
