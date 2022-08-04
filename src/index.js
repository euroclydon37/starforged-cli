#! /usr/bin/env node

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
const { readDb, writeDb } = require("./db");
const { getCharacter } = require("./selectors/character.selectors");

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
  const data = await readDb();
  const character = getCharacter(data);
  if (character.legacy_tracks) {
    console.log(
      "Update character legacy tracks to new format. Marking these tracks and viewing/spending experience should work correctly now."
    );
    character.legacy = {
      tracks: {
        quests: character.legacy_tracks.quests,
        bonds: character.legacy_tracks.bonds,
        discoveries: character.legacy_tracks.discoveries,
      },
      spent_xp: 0,
    };

    delete character.legacy_tracks;

    await writeDb(data);
  }

  const response = await prompts({
    type: "autocomplete",
    name: "command",
    message: "Choose a command.",
    choices: [
      {
        title: "Dice",
        description: "See what fate has in store!",
        value: "dice",
      },
      {
        title: "Vows",
        description: "Create, update, or delete vows.",
        value: "vows",
      },
      {
        title: "Moves",
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
        title: "Story",
        description: "Add or view events in your story.",
        value: "story",
      },
      {
        title: "Lore",
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
        title: "Character",
        description: "Create, update, or delete your character.",
        value: "manageCharacter",
      },
    ],
  });

  commands[response.command]();
}

run();
