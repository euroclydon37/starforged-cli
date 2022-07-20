const prompts = require("prompts");
const { readDb, writeDb } = require("../db");
const { selectCharacterStat } = require("../userPrompts");
const { getDiceResults, printDiceResults, rollDice } = require("../utils");

const commands = {
  roll: {
    title: "Roll Dice",
    description: "It's exactly what it sounds like.",
    run: async () => {
      const data = await readDb();

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
        const { shouldAddStat } = await prompts({
          type: "select",
          name: "shouldAddStat",
          message: "Should I add a stat?",
          choices: [
            { title: "Yes", value: true },
            { title: "No", value: false },
          ],
        });

        let bonus = 0;

        if (shouldAddStat) {
          const stat = await selectCharacterStat();
          bonus += stat.value;
        }

        const { additionalBonus } = await prompts({
          type: "number",
          name: "additionalBonus",
          message: "Enter any additional bonus.",
        });

        if (additionalBonus) {
          bonus += additionalBonus;
        }

        printDiceResults(await getDiceResults({ bonus }));
        return;
      }

      const { value } = await prompts({
        type: "number",
        name: "value",
        message: "What value would you like to use?",
      });

      printDiceResults(await getDiceResults({ value }));
    },
  },
};

async function dice() {
  const response = await prompts({
    type: "autocomplete",
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
