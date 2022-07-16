const prompts = require("prompts");
const { ranks } = require("../constants");
const { readDb, writeDb } = require("../db");
const { getCharacterStat, getNpc } = require("../queries");
const { rollDice, getDiceResults } = require("../utils");

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
    "Swear an Iron Vow": async () => {
      const data = await readDb();

      const { name, rank, isToAConnection, connectionName } = await prompts([
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
          type: "select",
          name: "isToAConnection",
          message: "Is this vow being made to a connection?",
          choices: [
            { title: "Yes", value: true },
            { title: "No", value: false },
          ],
        },
        {
          type: (prev) => (prev === true ? "autocomplete" : null),
          name: "connectionName",
          message: "Which connection?",
          choices: Object.keys(data.npcs).map((name) => ({
            title: name,
            value: name,
          })),
        },
      ]);

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

      console.log("Your vow has been sworn.");

      await rollDice();
      let bonus = (await getCharacterStat("heart")).value;

      if (isToAConnection) {
        const npc = await getNpc(connectionName);
        bonus += npc.bonded ? 2 : 1;
      }

      const { result } = getDiceResults({
        bonus,
        ...data.dice,
      });

      if (result === "strong hit") {
        data.character.meters.momentum += 2;
        console.log(
          "You are emboldened and it is clear what you must do next. +2 momentum."
        );
      }

      if (result === "weak hit") {
        data.character.meters.momentum += 1;
        console.log(
          "You are determined but begin your quest with more questions than answers. +1 momentum. Envision what you do to find a path forward."
        );
      }

      if (result === "miss") {
        console.log(
          "You must overcome a significant obstacle before you begin your quest. Envision what stands in your way."
        );
      }

      await writeDb(data);
    },
    "Fulfill Your Vow": () => {},
    "Forsake Your Vow": async () => {},
    "Reach a Milestone": () => {},
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
