const prompts = require("prompts");
const { act } = require("./commands/act");
const { readAsset } = require("./commands/assets");
const { createCharacter } = require("./commands/character");
const { runOracle } = require("./commands/oracles");

(async () => {
  const response = await prompts({
    type: "select",
    name: "command",
    message: "What would you like to do?",
    choices: [
      {
        title: "Action Roll",
        description: "See what fate has in store!",
        value: "action_roll",
      },
      {
        title: "Use an Oracle",
        description: "Roll up some random stuff.",
        value: "oracle",
      },
      {
        title: "Read an Asset",
        description: "Get a closer look at an asset.",
        value: "read_asset",
      },
      {
        title: "Create Character",
        description: "Create a character to play as.",
        value: "create_character",
      },
    ],
  });

  switch (response.command) {
    case "action_roll":
      return act();
    case "oracle":
      return runOracle();
    case "read_asset":
      return readAsset();
    case "create_character":
      return createCharacter();
  }
})();
