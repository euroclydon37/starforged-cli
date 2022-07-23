const prompts = require("prompts");
const { insertFact, addLoreEntry, insertRelatedEntry } = require("../setters");
const {
  getPropByPrompt,
  autocompletePromptByIndex,
} = require("../userPrompts");
const { readDb, writeDb } = require("../db");
const { adjust, remove } = require("ramda");

async function askForEntryName(message) {
  const data = await readDb();
  const entry = await getPropByPrompt({
    message,
    keyValueMap: data.lore,
  });
  return entry.name;
}

async function printEntry() {
  const entryName = await askForEntryName(
    "Which entry do you want to know about?"
  );
  const data = await readDb();
  console.log(data.lore[entryName]);
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

async function addFact() {
  const entryName = await askForEntryName(
    "Which entry would you like to add to?"
  );
  const { fact } = await prompts({
    type: "text",
    name: "fact",
    message: "What is the new fact?",
  });
  await insertFact(entryName, fact);
  console.log("Fact has been added.");
}

async function editFact() {
  const data = await readDb();
  const entry = await getPropByPrompt({
    message: "Which entry do you want to edit?",
    keyValueMap: data.lore,
  });

  const factIndex = await autocompletePromptByIndex({
    message: "Which fact do you want to edit?",
    choices: entry.facts,
  });

  const { newFact } = await prompts({
    type: "text",
    name: "newFact",
    message: "What do you want it to be?",
  });

  data.lore[entry.name].facts = adjust(factIndex, () => newFact, entry.facts);
  await writeDb(data);
  console.log("The fact has been updated.");
}

async function deleteFact() {
  const data = await readDb();
  const entry = await getPropByPrompt({
    message: "Which entry do you want to edit?",
    keyValueMap: data.lore,
  });

  const factIndex = await autocompletePromptByIndex({
    message: "Which fact do you want to edit?",
    choices: entry.facts,
  });

  data.lore[entry.name].facts = remove(factIndex, 1, entry.facts);
  await writeDb(data);
  console.log("The fact has been deleted.");
}

async function lore() {
  const commands = {
    printEntry,
    addFact,
    editFact,
    deleteFact,
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
