const prompts = require("prompts");
const { dice } = require("./commands/dice");
const { readAsset } = require("./commands/assets");
const { createCharacter } = require("./commands/character");
const { events } = require("./commands/events");
const { makeAMove } = require("./moves");
const { npc } = require("./commands/npc");
const { runOracle } = require("./commands/oracles");
const { vows } = require("./commands/vows");

const commands = {
  dice,
  events,
  npc,
  readAsset,
  createCharacter,
  runOracle,
  makeAMove,
  vows,
};

async function run() {
  const response = await prompts({
    type: "select",
    name: "command",
    message: "Choose a command.",
    choices: [
      {
        title: "Dice",
        description: "See what fate has in store!",
        value: "dice",
      },
      {
        title: "Manage Vows",
        description: "Create, update, or delete vows.",
        value: "vows",
      },
      {
        title: "Make a move",
        description: "Make one of Starforged many moves to progress the story.",
        value: "makeAMove",
      },
      {
        title: "NPC",
        description: "Create, edit, or otherwise interact with npcs.",
        value: "npc",
      },
      {
        title: "Events",
        description: "Log or view events.",
        value: "events",
      },
      {
        title: "Oracle",
        description: "Roll up some random stuff.",
        value: "runOracle",
      },
      {
        title: "Assets",
        description: "Get a closer look at an asset.",
        value: "readAsset",
      },
      {
        title: "Create Character",
        description: "Create a character to play as.",
        value: "createCharacter",
      },
    ],
  });

  commands[response.command]();
}

run();
