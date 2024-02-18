require("dotenv").config();
const Telebot = require("./app/Telebot");

const token = process.env.TELEGRAM_TOKEN;
const options = { polling: true };
const telebot = new Telebot(token, options);

const main = () => {
    telebot.sendSticker();
    telebot.sendGreeting();
    telebot.followMe();
    telebot.getRandQuote();
    telebot.getNews();
    telebot.getLatestEQ();
    telebot.showHelp();
}

main();