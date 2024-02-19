require("dotenv").config();
const Telebot = require("./app/Telebot");

// Bot Configuration
const token = process.env.TELEGRAM_TOKEN;
const options = { polling: true };

// Initializing Bot
console.log("Starting TeleBot by t4kezy.. 🎉")
const telebot = new Telebot(token, options);

const main = () => {
    console.log("Preparing feature... 🧐")
    telebot.sendSticker();
    telebot.sendGreeting();
    telebot.followMe();
    telebot.sendRandQuote();
    telebot.sendNews();
    telebot.sendLatestEQ();
    telebot.showHelp();
    telebot.showCommands(); // #1
    telebot.checkGender(); // #2
    telebot.sendActivity(); // #2
    telebot.sendJoke(); // #2
    telebot.changePrefix(); // #3
    // telebot.masihGatau(); // #5
    console.log("Feature loaded successfully.. 🎉")
}

main();
console.log("Bot is running.. 🥳🎉")