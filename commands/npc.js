const prompts = require("prompts");
const { ranks } = require("../constants");
const { readDb, writeDb } = require("../db");

const commands = {
  create: async () => {
    const data = await readDb();

    if (!data.npcs) {
      data.npcs = {};
    }

    const { name } = await prompts({
      type: "text",
      name: "name",
      message: "What is their name?",
    });

    if (data.npcs[name]) {
      console.log(name, "is taken");
      return;
    }

    data.npcs[name] = { name };
    await writeDb(data);
    console.log("Npc created.");
  },
  makeAConnection: async () => {
    const data = await readDb();

    if (!data.npcs) {
      data.npcs = {};
    }

    if (Object.values(data.npcs).length === 0) {
      console.log("No npcs have been created.");
      return;
    }

    const { name } = await prompts({
      type: "autocomplete",
      name: "name",
      message: "Who is the connection?",
      choices: Object.values(data.npcs).map(({ name }) => ({
        title: name,
        value: name,
      })),
    });

    const { role, rank } = await prompts([
      {
        type: "text",
        name: "role",
        message: "What is their role?",
      },
      {
        type: "autocomplete",
        name: "rank",
        message: "What's their rank?",
        choices: ranks.map((title) => ({ title, value: title })),
      },
    ]);

    data.npcs[name].rank = rank;
    data.npcs[name].role = role;
    data.npcs[name].bonded = false;

    await writeDb(data);
    console.log("Connection made");
  },
};

async function npc() {
  const response = await prompts({
    type: "select",
    name: "command",
    message: "What do you want to do?",
    choices: [
      {
        title: "Create an NPC",
        description: "Create a new character in your adventure!",
        value: "create",
      },
      {
        title: "Make a Connection",
        description:
          "This is a starforged move that will need to be... moved... at some point.",
        value: "makeAConnection",
      },
    ],
  });

  commands[response.command]();
}

module.exports = { npc };
