const { commandPrefix } = require("./dynamic");

function filtered({ keyword, type }, commandPrefix) {
  if (type === "only") {
    return new RegExp(`^${commandPrefix}${keyword}$`, "i");
  }
  if (type === "after") {
    return new RegExp(`^${commandPrefix}${keyword}\\s*(.+)`, "i");
  }

  throw new Error("Invalid type");
}

const commands = {
  bored: filtered({ keyword: "bored", type: "only" }, commandPrefix),
  commands: filtered({ keyword: "commands", type: "only" }, commandPrefix),
  eq: filtered({ keyword: "eq", type: "only" }, commandPrefix),
  greeting: filtered({ keyword: "greeting", type: "only" }, commandPrefix),
  help: filtered({ keyword: "help", type: "only" }, commandPrefix),
  info: filtered({ keyword: "info", type: "only" }, commandPrefix),
  joke: filtered({ keyword: "joke", type: "only" }, commandPrefix),
  news: filtered({ keyword: "news", type: "only" }, commandPrefix),
  quote: filtered({ keyword: "quote", type: "only" }, commandPrefix),

  cg: filtered({ keyword: "cg", type: "after" }, commandPrefix),
  cp: filtered({ keyword: "cp", type: "after" }, commandPrefix, commandPrefix),
  follow: filtered({ keyword: "follow", type: "after" }, commandPrefix),
};

module.exports = commands;
