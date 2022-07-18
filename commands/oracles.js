const prompts = require("prompts");
const {
    keys,
    path,
    pipe,
    replace,
    map,
    compose,
    not,
    equals,
    head,
    split,
    prop,
} = require("ramda");
const Tables = require("../oracles.json");
const {getTableResult, randomInteger} = require("../utils");
const {starforged} = require("dataforged");

async function chooseOracle(oraclesAndCategories = []) {
    const {index} = await prompts({
        type: "select",
        name: "index",
        message: "Which table?",
        choices: oraclesAndCategories.map(prop("Name")),
    });

    const choice = oraclesAndCategories[index];

    if (choice.Categories || choice.Oracles) {
        return chooseOracle([
            ...(choice.Categories ?? []),
            ...(choice.Oracles ?? []),
        ]);
    }

    const roll = randomInteger({max: 100})

    return choice.Table.find(({Floor, Ceiling}) => roll >= Floor && roll <= Ceiling).Result
}

async function runOracle() {
    console.log(await chooseOracle(starforged["Oracle Categories"]));
}

module.exports = {runOracle};
