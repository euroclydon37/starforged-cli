const prompts = require("prompts");
const { sort, has } = require("ramda");
const { readDb, writeDb } = require("../db");
const { selectCharacterStat, selectCharacterAsset } = require("../userPrompts");
const { getDiceResults, printDiceResults, rollDice } = require("../utils");

const commands = {
  roll: {
    title: "Roll Dice",
    description: "It's exactly what it sounds like.",
    run: async () => {
      const { diceNames } = await prompts({
        type: "multiselect",
        name: "diceNames",
        message: "Which dice?",
        choices: Object.keys(data.dice).map((dieName) => ({
          title: dieName,
          value: dieName,
        })),
      });

      await rollDice(diceNames);

      await writeDb(data);
      console.log(
        "Dice have been rolled! Now use the interpret command to see your results."
      );
    },
  },
  interpretResults: {
    title: "Interpret Results",
    description: "Interpret the dice results, taking into account bonuses.",
    run: async () => {
      const data = await readDb();
      const { isUsingActionDie } = await prompts({
        type: "select",
        name: "isUsingActionDie",
        message: "What value do you want to use?",
        choices: [
          { title: "The action die", value: true },
          { title: "A static value", value: false },
        ],
      });

      if (isUsingActionDie) {
        const { bonusType } = await prompts({
          type: "select",
          name: "bonusType",
          message: "What bonus should I add?",
          choices: [
            { title: "A stat", value: "stat" },
            {
              title: "An asset condition meter",
              value: "asset_condition_meter",
            },
            { title: "none", value: "none" },
          ],
        });

        if (bonusType === "stat") {
          const stat = await selectCharacterStat();

          printDiceResults(getDiceResults({ bonus: stat.value }));
          return;
        }

        if (bonusType === "asset_condition_meter") {
          const asset = await selectCharacterAsset();

          if (!has("condition_meter")(asset)) {
            console.log("That asset doesn't have a condition meter.");
          }

          printDiceResults(getDiceResults({ bonus: asset.condition_meter }));
          return;
        }

        if (bonusType === "none") {
          printDiceResults(getDiceResults());
          return;
        }

        return;
      }

      const { value } = await prompts({
        type: "number",
        name: "value",
        message: "What value would you like to use?",
      });

      printDiceResults(
        getDiceResults({
          ...data.dice,
          action: value,
        })
      );
    },
  },
};

async function dice() {
  const response = await prompts({
    type: "select",
    name: "command",
    message: "Choose a command.",
    choices: Object.keys(commands).map((key) => {
      const command = commands[key];
      return {
        title: command.title,
        description: command.description,
        value: key,
      };
    }),
  });

  commands[response.command].run();
}

module.exports = { dice };
