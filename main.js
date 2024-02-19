require("dotenv").config();
const Telebot = require("./app/Telebot");

const token = process.env.TELEGRAM_TOKEN;
const options = { polling: true };
const telebot = new Telebot(token, options);

const main = () => {
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
}

main();