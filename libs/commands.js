const commands = {
  greeting: /^!greeting$/i,
  follow: /^!follow\s+(.+)/i,
  quote: /^!quote$/i,
  news: /^!news$/i,
  eq: /^!eq$/i,
  help: /^!help$/i,
  commands: /^!commands$/i,
  cg: /^!cg\s+(.+)/i,
  cp: /^!cp\s+([?~.#$^/]+)/i,
  bored: /^!bored$/i,
  joke: /^!joke$/i,  
  info: /^!info$/i,  
};

module.exports = commands;
