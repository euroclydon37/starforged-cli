require("prompts");

const {starforged} = require("dataforged");
const {chooseOracle} = require("../userPrompts");

async function runOracle() {
    console.log(await chooseOracle(starforged["Oracle Categories"]));
}

module.exports = {runOracle};
