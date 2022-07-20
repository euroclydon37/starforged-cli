const prompts = require("prompts");
const { getLoreEntry } = require("../getters");
const { addFact, addLoreEntry, insertRelatedEntry } = require("../setters");
const { getPropByPrompt } = require("../userPrompts");
const { readDb } = require("../db");

async function askForEntryName(message) {
  const data = await readDb();
  const entry = await getPropByPrompt({
    message,
    keyValueMap: data.lore,
  });
  return entry.name;
}

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

async function addRelatedEntry() {
  const targetEntryName = await askForEntryName(
    "Which entry would you like to add to?"
  );
  const relatedEntryName = await askForEntryName("Which entry relates to it?");
  await insertRelatedEntry(targetEntryName, relatedEntryName);
  console.log("Related entry added.");
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
