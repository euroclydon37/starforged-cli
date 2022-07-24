const prompts = require("prompts");
const { readDb, writeDb } = require("../db");
const {
  autocompletePromptByIndex,
  getPropByPrompt,
} = require("../userPrompts");
const { remove, adjust } = require("ramda");

async function logEvent() {
  const data = await readDb();

  if (!data.events) {
    data.events = [];
  }

  const input = await prompts({
    type: "text",
    name: "text",
    message: "What happened?",
  });

  data.events.push(input.text);

  writeDb(data);
}

async function reviewEvents() {
  const data = await readDb();

  const { count } = await prompts({
    type: "number",
    name: "count",
    message: "How many events?",
  });

  const events = data.events ?? [];

  console.log(`\n...\n\n${events.slice(count * -1).join("\n\n")}\n`);
}

async function editEvent() {
  const data = await readDb();

  const index = await autocompletePromptByIndex({
    message: "Which event?",
    choices: data.events,
  });

  const input = await prompts({
    type: "text",
    name: "text",
    message: "What happened?",
  });

  data.events = adjust(index, () => input.text, data.events);
  await writeDb(data);
}

async function deleteEvent() {
  const data = await readDb();

  const index = await autocompletePromptByIndex({
    message: "Which event?",
    choices: data.events,
  });

  data.events = remove(index, 1, data.events);
  await writeDb(data);
}

async function story() {
  const commands = {
    logEvent,
    reviewEvents,
    editEvent,
    deleteEvent,
  };
  const command = await getPropByPrompt({
    message: "And now what?",
    keyValueMap: commands,
  });

  await command();
}

module.exports = { story };
