const prompts = require("prompts");
const { readDb, writeDb } = require("../db");
const { selectVow } = require("../userPrompts");

async function forsakeYourVow() {
  const data = await readDb();
  const vow = await selectVow();

  delete data.vows[vow.name];

  console.log(`Forsaking "${vow.name}"`);
  const { punishment } = await prompts({
    type: "select",
    name: "punishment",
    message: `Forsaking your vow to ${vow.name}. What's the cost?`,
    choices: [
      "You are demoralized or dispirited: make the Endure Stress move.",
      "A connection loses faith: make the Test Your Relationship move when you next interact",
      "You must abandon a path or resource: Discard an asset.",
      "Someone else pays a price: Envision how a person, being, or community bears the cost of the failure.",
      "Someone else takes advantage: Envision how an enemy gains power.",
      "Your reputation suffers: Envision how this failure marks you.",
    ],
  });

  if (punishment === 0) {
    console.log("Code the endure stress move.");
  }

  if (punishment === 1) {
    console.log("You'll need to test your relationship later.");
  }

  if (punishment === 2) {
    console.log("Need to code this part.");
  }

  if (punishment > 2) {
    console.log("Fit your choice into the narrative.");
  }

  await writeDb(data);
}

module.exports = { forsakeYourVow };
