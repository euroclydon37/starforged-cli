const prompts = require("prompts");
const { ranks } = require("../constants");
const { readDb, writeDb } = require("../db");
const { getCharacterStat, getNpc } = require("../getters");
const { getDiceResults, rollDice } = require("../utils");

async function swearAnIronVow() {
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
}

module.exports = { swearAnIronVow };
