const prompts = require("prompts");
const { act } = require("./commands/act");
const { readAsset } = require("./commands/assets");
const { createCharacter } = require("./commands/character");
const { events } = require("./commands/events");
const { npc } = require("./commands/npc");
const { runOracle } = require("./commands/oracles");

const commands = {
  act,
  events,
  npc,
  readAsset,
  createCharacter,
  runOracle,
};

async function run() {
  const response = await prompts({
    type: "select",
    name: "command",
    message: "Choose a command.",
    choices: [
      {
        title: "Action Roll",
        description: "See what fate has in store!",
        value: "act",
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
