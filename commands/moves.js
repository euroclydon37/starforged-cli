const prompts = require("prompts");
const { ranks } = require("../constants");
const { readDb, writeDb } = require("../db");

const moves = {
  Legacy: {
    Advance: () => {},
    "Continue a Legacy": () => {},
    "Earn Experience": () => {},
  },
  Adventure: {
    "Aid Your Ally": () => {},
    "Check Your Gear": () => {},
    Compel: () => {},
    "Face Danger": () => {},
    "Gather Information": () => {},
    "Secure an Advantage": () => {},
  },
  Fate: {
    "Ask the Oracle": () => {},
    "Pay the Price": () => {},
  },
  Combat: {
    Battle: () => {},
    Clash: () => {},
    "Enter the Fray": () => {},
    "Face Defeat": () => {},
    "Gain Ground": () => {},
    "React Under Fire": () => {},
    Strike: () => {},
    "Take Decisive Action": () => {},
  },
  Session: {
    "Begin a Session": () => {},
    "Change Your Fate": () => {},
    "End a Session": () => {},
    "Set a Flag": () => {},
    "Take a Break": () => {},
  },
  Suffer: {
    "Companion Takes a Hit": () => {},
    "Endure Harm": () => {},
    "Endure Stress": () => {},
    "Lose Momentum": () => {},
    "Sacrifice Resources": () => {},
    "Withstand Damage": () => {},
  },
  Exploration: {
    "Confront Chaos": () => {},
    "Explore a Waypoint": () => {},
    "Finish an Expedition": () => {},
    "Make a Discovery": () => {},
    "Set a Course": () => {},
    "Undertake an Expedition": () => {},
  },
  Connection: {
    "Develop Your Relationship": () => {},
    "Forge a Bond": () => {},
    "Make a Connection": () => {},
    "Test Your Relationship": () => {},
  },
  Threshold: {
    "Face Death": () => {},
    "Face Desolation": () => {},
    "Overcome Destruction": () => {},
  },
  Quest: {
    "Forsake Your Vow": async () => {
      const { name, rank, isToAConnection } = await prompts([
        {
          type: "text",
          name: "name",
          message: "What do you vow to do?",
        },
        {
          type: "autocomplete",
          name: "rank",
          message: "What rank is it?",
          choices: ranks.map((value) => ({ title: value, value })),
        },
        {
          type: "autocomplete",
          name: "isToAConnection",
          message: "Is this vow being made to a connection?",
          choices: [
            { title: "Yes", value: true },
            { title: "No", value: false },
          ],
        },
      ]);

      const data = await readDb();

      if (!data.vows) {
        data.vows = {};
      }

      if (data.vows[name]) {
        console.log("That vow already exists.");
        return;
      }

      data.vows[name] = {
        name,
        rank,
        progress: 0,
      };

      await writeDb(data);

      console.log("Your vow has been sworn.");
    },
    "Fulfill Your Vow": () => {},
    "Reach a Milestone": () => {},
    "Swear an Iron Vow": () => {},
  },
  Recover: {
    Heal: () => {},
    Hearten: () => {},
    Repair: () => {},
    Resupply: () => {},
    Sojourn: () => {},
  },
};

async function makeAMove() {
  const { category, move } = await prompts([
    {
      type: "autocomplete",
      name: "category",
      message: "Choose a category.",
      choices: Object.keys(moves).map((value) => ({ title: value, value })),
    },
    {
      type: "autocomplete",
      name: "move",
      message: "Choose a move.",
      choices: (category) =>
        Object.keys(moves[category]).map((value) => ({ title: value, value })),
    },
  ]);

  moves[category][move]();
}

module.exports = { makeAMove };
