let commandPrefix = "!"; // Default prefix set to "!"

function changePrefix(newPrefix) {
  commandPrefix = newPrefix;
  console.log("Command Prefix changed to =>", commandPrefix)
  return commandPrefix;
}

module.exports = { commandPrefix, changePrefix };
