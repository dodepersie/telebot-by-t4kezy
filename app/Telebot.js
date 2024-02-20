const TelegramBot = require("node-telegram-bot-api");
const commands = require("../libs/commands");
const { helpMessage, invalidCommand } = require("../libs/constant");
const {
  handleMessage,
  handleCallbackQuery,
  sendRandomQuoteHandler,
  sendNewsHandler,
  sendLatestEQHandler,
  checkGenderHandler,
  sendActivityHandler,
  sendJokeHandler,
} = require("../libs/function");
const { changePrefix } = require("../libs/dynamic");

class Telebot extends TelegramBot {
  constructor(token, options) {
    super(token, options);
    this.on("message", (data) => {
      handleMessage(data, this.sendMessage.bind(this), invalidCommand);
    });

    this.on("callback_query", (callback) => {
      handleCallbackQuery(callback, this.sendMessage.bind(this), helpMessage);
    });
  }

  // Bot will greet you
  sendGreeting() {
    this.onText(commands.greeting, (data) => {
      console.log(`Send Greeting executed by => ${data.from.username}`);
      this.sendMessage(data.from.id, `Hello, ${data.from.first_name}! 😜`);
    });
  }

  // Bot will reply sender's sticker with the actual emoji
  sendSticker() {
    this.on("sticker", (data) => {
      console.log(`Send Sticker executed by => ${data.from.username}`);
      this.sendMessage(data.from.id, data.sticker.emoji);
    });
  }

  // Bot will follow sender's message
  followMe() {
    this.onText(commands.follow, (data, after) => {
      console.log(`Follow Me executed by => ${data.from.username}`);
      this.sendMessage(data.from.id, after[1]);
    });
  }

  // Bot will send random Kanye West's quote
  sendRandQuote() {
    this.onText(commands.quote, (data) => {
      sendRandomQuoteHandler(
        data,
        this.sendMessage.bind(this),
        this.deleteMessage.bind(this)
      );
    });
  }

  // Bot will send latest news from Jakpost API
  sendNews() {
    this.onText(commands.news, async (data) => {
      console.log(`News executed by => ${data.from.username}`);
      sendNewsHandler(
        data,
        this.sendMessage.bind(this),
        this.sendPhoto.bind(this),
        this.deleteMessage.bind(this)
      );
    });
  }

  // Get Latest Indonesia Earthquake from BMKG
  sendLatestEQ() {
    this.onText(commands.eq, async (data) => {
      sendLatestEQHandler(
        data,
        this.sendMessage.bind(this),
        this.sendPhoto.bind(this),
        this.deleteMessage.bind(this)
      );
    });
  }

  // Show help commnads
  showHelp() {
    this.onText(commands.help, (data) => {
      console.log(`Help executed by => ${data.from.username}`);
      this.sendMessage(data.from.id, helpMessage);
    });
  }

  /*
   ** TUGAS #1 - Done
   ** munculkan menu Listing COMMANDS yang bot kita punya lewat TOMBOL ketika user ketik !commands
   */
  showCommands() {
    this.onText(commands.commands, (data) => {
      console.log(`Command Menu executed by => ${data.from.username}`);
      this.sendMessage(data.from.id, "There are some available commands:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Greet me!~",
                callback_data: "go_to_greeting",
              },
            ],
            [
              {
                text: "Quote 🤩",
                callback_data: "go_to_quote",
              },
              {
                text: "Latest News 🗞️",
                callback_data: "go_to_news",
              },
            ],
            [
              {
                text: "Latest Earthquake Information 😱",
                callback_data: "go_to_eq",
              },
            ],
            [
              {
                text: "I am bored 😢",
                callback_data: "go_to_activity",
              },
              {
                text: "Make me laugh 😏",
                callback_data: "go_to_joke",
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    });

    this.on("callback_query", async (callback) => {
      const callbackName = callback.data;
      switch (callbackName) {
        case "go_to_greeting":
          this.sendMessage(
            callback.from.id,
            `Hello, ${callback.from.first_name}! 😜`
          );
          break;
        case "go_to_quote":
          await sendRandomQuoteHandler(
            callback,
            this.sendMessage.bind(this),
            this.deleteMessage.bind(this)
          );
          break;
        case "go_to_news":
          await sendNewsHandler(
            callback,
            this.sendMessage.bind(this),
            this.sendPhoto.bind(this),
            this.deleteMessage.bind(this)
          );
          break;
        case "go_to_eq":
          await sendLatestEQHandler(
            callback,
            this.sendMessage.bind(this),
            this.sendPhoto.bind(this),
            this.deleteMessage.bind(this)
          );
          break;
        case "go_to_activity":
          await sendActivityHandler(
            callback,
            this.sendMessage.bind(this),
            this.deleteMessage.bind(this)
          );
          break;
        case "go_to_joke":
          await sendJokeHandler(
            callback,
            this.sendMessage.bind(this),
            this.deleteMessage.bind(this)
          );
          break;
        default:
          break;
      }
    });
  }

  /*
   ** TUGAS #2 - Done
   ** tambahkan fitur baru dari API public apapun
   */
  checkGender() {
    this.onText(commands.cg, async (data, after) => {
      await checkGenderHandler(
        data,
        after,
        this.sendMessage.bind(this),
        this.deleteMessage.bind(this)
      );
    });
  }

  sendActivity() {
    this.onText(commands.bored, async (data) => {
      await sendActivityHandler(
        data,
        this.sendMessage.bind(this),
        this.deleteMessage.bind(this)
      );
    });
  }

  sendJoke() {
    this.onText(commands.joke, async (data) => {
      await sendJokeHandler(
        data,
        this.sendMessage.bind(this),
        this.deleteMessage.bind(this)
      );
    });
  }

  /*
   ** TUGAS #5
   ** Explore functions yang ada
   */
  masihGatau() {
    console.log("Masih bingung!");
  }
}

module.exports = Telebot;
