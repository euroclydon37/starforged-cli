const prompts = require("prompts");
const { readDb, writeDb } = require("../db");

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

module.exports = { logEvent };
