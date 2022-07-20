const { marked } = require("marked");
const TerminalRenderer = require("marked-terminal");
const chalk = require("chalk");
const { chooseAsset } = require("../userPrompts");
const { printAsset } = require("../utils");

marked.setOptions({
  renderer: new TerminalRenderer({ strong: chalk.green.bold }),
});

async function readAsset() {
  const asset = await chooseAsset();

  printAsset(asset);
}

module.exports = { readAsset };
