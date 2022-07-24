require("prompts");

const { starforged } = require("dataforged");
const { getResultsFromOracles } = require("../userPrompts");

async function runOracle() {
  console.log(
    JSON.stringify(
      await getResultsFromOracles(starforged["Oracle Categories"]),
      null,
      2
    )
  );
}

module.exports = { runOracle };
