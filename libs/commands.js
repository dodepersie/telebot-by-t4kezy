/*
 ** TUGAS #3 - Almost Done
 ** buat identifier / custom prefix commands
 */

let commandPrefix = "!"; // Default prefix set to "!"

function filtered({ keyword, type }) {
  if (type === "only") return new RegExp(`^${commandPrefix}${keyword}$`, "i");
  if (type === "after")
    return new RegExp(`^${commandPrefix}${keyword}\\s*(.+)`, "i");
}

const commands = {
  bored: filtered({ keyword: "bored", type: "only" }),
  commands: filtered({ keyword: "commands", type: "only" }),
  eq: filtered({ keyword: "eq", type: "only" }),
  greeting: filtered({ keyword: "greeting", type: "only" }),
  help: filtered({ keyword: "help", type: "only" }),
  info: filtered({ keyword: "info", type: "only" }),
  joke: filtered({ keyword: "joke", type: "only" }),
  news: filtered({ keyword: "news", type: "only" }),
  quote: filtered({ keyword: "quote", type: "only" }),

  cg: filtered({ keyword: "cg", type: "after" }),
  follow: filtered({ keyword: "follow", type: "after" }),
};

module.exports = commands;
