const prompts = require("prompts");
const { starforged } = require("dataforged");
const { marked } = require("marked");
const TerminalRenderer = require("marked-terminal");
const chalk = require("chalk");

marked.setOptions({
  renderer: new TerminalRenderer({
    strong: chalk.green.bold,
  }),
});

async function readAsset() {
  const { typeIndex, assetIndex } = await prompts([
    {
      type: "select",
      name: "typeIndex",
      message: "Pick a category.",
      choices: starforged["Asset Types"].map((assetType) => assetType.Name),
    },
    {
      type: "select",
      name: "assetIndex",
      message: "Pick an asset.",
      choices: (typeIndex) =>
        starforged["Asset Types"][typeIndex].Assets.map((asset) => asset.Name),
    },
  ]);

  const asset = starforged["Asset Types"][typeIndex].Assets[assetIndex];

  console.log(
    marked(
      [
        `# ${asset.Name}`,
        asset.Requirement,
        asset.Abilities.map((ability) => `- ${ability.Text}`).join("\n"),
      ].join("\n")
    )
  );
}

module.exports = { readAsset };
