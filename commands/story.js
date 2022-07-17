const prompts = require("prompts");
const { readDb, writeDb } = require("../db");

const commands = {
  logEvent: async () => {
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
  },
  reviewEvents: async () => {
    const data = await readDb();

    const { count } = await prompts({
      type: "number",
      name: "count",
      message: "How many events?",
    });

    const events = data.events ?? [];

    console.log(`\n...\n\n${events.slice(count * -1).join("\n\n")}\n`);
  },
};

async function story() {
  const response = await prompts({
    type: "select",
    name: "command",
    message: "And now what?",
    choices: [
      {
        title: "Log an Event",
        description: "Keep a history of what your character accomplishes.",
        value: "logEvent",
      },
      {
        title: "View an Event",
        description: "Review the story up to this point.",
        value: "reviewEvents",
      },
    ],
  });

  commands[response.command]();
}

module.exports = { story };
