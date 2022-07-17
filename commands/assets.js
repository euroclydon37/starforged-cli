const prompts = require("prompts");
const { replace, pipe, split, map, splitEvery, join } = require("ramda");
const assets = require("../assets.json");
const { printAsset } = require("../utils");

async function readAsset() {
  const response = await prompts({
    type: "select",
    name: "index",
    message: "Which asset?",
    choices: assets.map((asset) => asset.name),
  });

  printAsset(assets[response.index]);
}

module.exports = { readAsset };
