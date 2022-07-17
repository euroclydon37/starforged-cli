const prompts = require("prompts");
const { getLoreEntry } = require("../getters");
const { addFact, addLoreEntry, addRelatedEntry } = require("../setters");
const { toTitle } = require("../utils");

async function createLoreEntry() {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "What's this entry called?",
  });

  const { firstFact } = await prompts({
    type: "text",
    name: "firstFact",
    message: "What is its first fact?",
  });

  await addLoreEntry(name, firstFact);
}

async function lore() {
  const commands = {
    getLoreEntry,
    addFact,
    createLoreEntry,
    addRelatedEntry,
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

module.exports = { lore };
