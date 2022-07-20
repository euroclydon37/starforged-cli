const prompts = require("prompts");
const { dice } = require("./commands/dice");
const { readAsset } = require("./commands/assets");
const { manageCharacter } = require("./commands/character");
const { story } = require("./commands/story");
const { referenceAMove } = require("./commands/referenceAMove");
const { npc } = require("./commands/npc");
const { runOracle } = require("./commands/oracles");
const { vows } = require("./commands/vows");
const { lore } = require("./commands/lore");

const commands = {
  dice,
  story,
  npc,
  readAsset,
  manageCharacter,
  runOracle,
  referenceAMove,
  vows,
  lore,
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
        title: "Reference a move",
        description:
          "Reference one of Starforged many moves and progress the story.",
        value: "referenceAMove",
      },
      {
        title: "NPC",
        description: "Create, edit, or otherwise interact with npcs.",
        value: "npc",
      },
      {
        title: "Manage Story",
        description: "Add or view events in your story.",
        value: "story",
      },
      {
        title: "Manage Lore",
        description: "Add, remove, or edit the lore of your universe.",
        value: "lore",
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
        title: "Manage Character",
        description: "Create, update, or delete your character.",
        value: "manageCharacter",
      },
    ],
  });

  commands[response.command]();
}

run();
