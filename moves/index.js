const prompts = require("prompts");
const { toUpper, prop } = require("ramda");
const moves = require("../moves.json");

const moveMap = {
  Legacy: ["Advance", "Continue a Legacy", "Earn Experience"],
  Adventure: [
    "Aid Your Ally",
    "Check Your Gear",
    "Compel",
    "Face Danger",
    "Gather Information",
    "Secure an Advantage",
  ],
  Fate: ["Ask the Oracle", "Pay the Price"],
  Combat: [
    "Battle",
    "Clash",
    "Enter the Fray",
    "Face Defeat",
    "Gain Ground",
    "React Under Fire",
    "Strike",
    "Take Decisive Action",
  ],
  Session: [
    "Begin a Session",
    "Change Your Fate",
    "End a Session",
    "Set a Flag",
    "Take a Break",
  ],
  Suffer: [
    "Companion Takes a Hit",
    "Endure Harm",
    "Endure Stress",
    "Lose Momentum",
    "Sacrifice Resources",
    "Withstand Damage",
  ],
  Exploration: [
    "Confront Chaos",
    "Explore a Waypoint",
    "Finish an Expedition",
    "Make a Discovery",
    "Set a Course",
    "Undertake an Expedition",
  ],
  Connection: [
    "Develop Your Relationship",
    "Forge a Bond",
    "Make a Connection",
    "Test Your Relationship",
  ],
  Threshold: ["Face Death", "Face Desolation", "Overcome Destruction"],
  Quest: [
    "Swear an Iron Vow",
    "Fulfill Your Vow",
    "Forsake Your Vow",
    "Reach a Milestone",
  ],
  Recover: ["Heal", "Hearten", "Repair", "Resupply", "Sojourn"],
};

async function referenceAMove() {
  const { move } = await prompts([
    {
      type: "autocomplete",
      name: "category",
      message: "Choose a category.",
      choices: Object.keys(moveMap).map((value) => ({ title: value, value })),
    },
    {
      type: "autocomplete",
      name: "move",
      message: "Choose a move.",
      choices: (category) =>
        moveMap[category].map((value) => ({ title: value, value })),
    },
  ]);

  console.log(prop(toUpper(move))(moves));
}

module.exports = { referenceAMove };
