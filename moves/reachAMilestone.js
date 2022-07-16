const { markProgressOnVow } = require("../setters");
const { selectVow } = require("../userPrompts");

async function reachAMilestone() {
  const vow = await selectVow();
  await markProgressOnVow(vow);
}

module.exports = { reachAMilestone };
