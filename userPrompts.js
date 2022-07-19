const prompts = require("prompts");
const {readDb} = require("./db");
const {getCharacterStat} = require("./getters");
const {prop} = require("ramda");
const {randomInteger} = require("./utils");

async function selectCharacterStat() {
    const data = await readDb();
    const {statName} = await prompts({
        type: "select",
        name: "statName",
        message: "Which stat?",
        choices: Object.keys(data.character.stats).map((key) => ({
            title: key,
            value: key,
        })),
    });

    return await getCharacterStat(statName);
}

async function selectCharacterAsset() {
    const data = await readDb();
    const {index} = await prompts({
        type: "select",
        name: "index",
        message: "Which asset?",
        choices: data.character.assets.map((asset, index) => ({
            title: asset.name,
            value: index,
        })),
    });
    return data.character.assets[index];
}

async function selectNpc() {
    const data = await readDb();

    const {name} = await prompts({
        type: "autocomplete",
        name: "name",
        message: "Which NPC?",
        choices: Object.keys(data.npcs).map((name) => ({
            title: name,
            value: name,
        })),
    });

    return data.npcs[name];
}

async function selectVow() {
    const data = await readDb();

    const {vowName} = await prompts({
        type: "autocomplete",
        name: "vowName",
        message: "Which Vow?",
        choices: Object.keys(data.vows).map((name) => ({
            title: name,
            value: name,
        })),
    });

    return data.vows[vowName];
}

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

    return choice.Table.find(({Floor, Ceiling}) => roll >= Floor && roll <= Ceiling).Result;
}

module.exports = {
    selectCharacterStat,
    selectCharacterAsset,
    selectNpc,
    selectVow,
    chooseOracle
};
