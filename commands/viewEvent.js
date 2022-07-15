const prompts = require("prompts");
const { readDb } = require("../db");

async function viewEvent() {
  const data = await readDb();

  const { count } = await prompts({
    type: "number",
    name: "count",
    message: "How many events?",
  });

  const events = data.events ?? [];

  console.log(`\n...\n\n${events.slice(count * -1).join("\n\n")}\n`);
}

module.exports = { viewEvent };
