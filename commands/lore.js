const prompts = require("prompts");
const { getLoreEntry } = require("../getters");
const { addFact, addLoreEntry, addRelatedEntry } = require("../setters");
const { getPropByPrompt } = require("../userPrompts");

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

  const command = await getPropByPrompt({
    message: "Choose a command.",
    keyValueMap: commands,
  });

  await command();
}

module.exports = { lore };
