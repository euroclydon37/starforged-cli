const prompts = require("prompts");
const { ranks } = require("../constants");
const { readDb, writeDb } = require("../db");
const { markProgressOnConnection, loseConnection } = require("../setters");
const { selectNpc } = require("../userPrompts");

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
    data.npcs[name].progress = 0;
    data.npcs[name].relationship_broken = false;
    data.npcs[name].bonded = false;

    await writeDb(data);
    console.log("Connection made");
  },
  markProgress: async () => {
    const npc = await selectNpc();
    await markProgressOnConnection(npc);
  },
  loseConnection: async () => {
    const npc = await selectNpc();
    await loseConnection(npc);
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
      {
        title: "Mark Progress on Connection",
        description: "Add some ticks to the progress boxes of a connection.",
        value: "markProgress",
      },
      {
        title: "Lose a Connection",
        description: "Sometimes you just can't get along.",
        value: "loseConnection",
      },
    ],
  });

  commands[response.command]();
}

module.exports = { npc };
