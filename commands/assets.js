const prompts = require("prompts");
const { replace, pipe, split, map, splitEvery, join } = require("ramda");
const assets = require("../assets.json");

const log = (label) => (value) => {
  console.log(label, value);
  return value;
};

const formatAsset = (asset) =>
  [
    asset.type,
    asset.name,
    ...asset.abilities.map(
      ({ acquired, text }) =>
        `${acquired ? "[x]" : "[ ]"} - ${pipe(
          split("\n"),
          map(pipe(split(" "), splitEvery(14), map(join(" ")), join("\n"))),
          join("\n"),
          replace(/\n/g, "\n\t")
        )(text)}`
    ),
  ].join("\n\n");

async function readAsset() {
  const response = await prompts({
    type: "select",
    name: "index",
    message: "Which asset?",
    choices: assets.map((asset) => asset.name),
  });

  console.log(`\n${formatAsset(assets[response.index])}\n`);
}

module.exports = { readAsset };
