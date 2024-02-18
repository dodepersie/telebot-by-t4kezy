const TelegramBot = require("node-telegram-bot-api");
const commands = require("../libs/commands");
const { helpMessage, invalidCommand } = require("../libs/constant");
const {
  sendRandomQuoteHandler,
  sendNewsHandler,
  sendLatestEQHandler,
  checkGenderHandler,
  sendActivityHandler,
  sendJokeHandler,
} = require("../libs/function");

class Telebot extends TelegramBot {
  constructor(token, options) {
    super(token, options);
    this.on("message", (data) => {
      const isCommands = Object.values(commands).some((keyword) =>
        keyword.test(data.text)
      );

      if (!isCommands) {
        console.log(
          `Invalid command executed by: ${data.from.username} => ${data.text}`
        );

        this.sendMessage(data.from.id, invalidCommand, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Panduan Pengguna",
                  callback_data: "go_to_help",
                },
              ],
            ],
          },
        });
      }
    });

    this.on("callback_query", (callback) => {
      const callbackName = callback.data;
      if (callbackName == "go_to_help") {
        this.sendMessage(callback.from.id, helpMessage);
      }
    });
  }

  // Bot will greet you
  sendGreeting() {
    this.onText(commands.greeting, (data) => {
      console.log(`Send Greeting executed by => ${data.from.username}`);
      this.sendMessage(data.from.id, "Halo juga 😜");
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
      this.sendMessage(data.from.id, `Kamu baru saja mengetik: ${after[1]}`);
    });
  }

  // Bot will send random Kanye West's quote
  sendRandQuote() {
    this.onText(commands.quote, (data) => {
      sendRandomQuoteHandler(data, this.sendMessage.bind(this));
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
      this.sendMessage(
        data.from.id,
        "Berikut adalah commands yang dapat digunakan pada bot ini:",
        {
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
                  text: "Kanye West's Quote 🤩",
                  callback_data: "go_to_quote",
                },
              ],
              [
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
              ],
              [
                {
                  text: "Make me laugh 😏",
                  callback_data: "go_to_joke",
                },
              ],
            ],
          },
        }
      );
    });

    this.on("callback_query", async (callback) => {
      const callbackName = callback.data;
      if (callbackName == "go_to_greeting") {
        this.sendMessage(
          callback.from.id,
          `Halo, ${callback.from.first_name}! 😜`
        );
      }

      if (callbackName == "go_to_quote") {
        try {
          await sendRandomQuoteHandler(callback, this.sendMessage.bind(this));
        } catch (err) {
          console.error(err);
          this.sendMessage(callback.from.id, "Error fetching quote.");
        }
      }

      if (callbackName == "go_to_news") {
        try {
          await sendNewsHandler(
            callback,
            this.sendMessage.bind(this),
            this.sendPhoto.bind(this),
            this.deleteMessage.bind(this)
          );
        } catch (err) {
          console.error(err);
          this.sendMessage(callback.from.id, "Error fetching news.");
        }
      }

      if (callbackName == "go_to_eq") {
        try {
          await sendLatestEQHandler(
            callback,
            this.sendMessage.bind(this),
            this.sendPhoto.bind(this),
            this.deleteMessage.bind(this)
          );
        } catch (err) {
          console.error(err);
          this.sendMessage(
            callback.from.id,
            "Error fetching earthquake information."
          );
        }
      }

      if (callbackName == "go_to_activity") {
        try {
          await sendActivityHandler(
            callback,
            this.sendMessage.bind(this),
            this.deleteMessage.bind(this)
          );
        } catch (err) {
          console.error(err);
          this.sendMessage(callback.from.id, "Error fetching activity..");
        }
      }

      if (callbackName == "go_to_joke") {
        try {
          await sendJokeHandler(
            callback,
            this.sendMessage.bind(this),
            this.deleteMessage.bind(this)
          );
        } catch (err) {
          console.error(err);
          this.sendMessage(callback.from.id, "Error fetching activity..");
        }
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
   ** TUGAS #3 - Not Done
   ** buat identifier / custom prefix commands
   */
  changePrefix() {
    this.onText(commands.cp, (msg, after) => {
      if (after && after[1]) {
        const newPrefix = after[1];

        for (const key in commands) {
          if (key !== "cp") {
            commands[key] = new RegExp(`^${newPrefix}${key}\\s+(.+)`);
          }
        }

        this.sendMessage(
          msg.from.id,
          `Prefix berhasil diubah menjadi => ${newPrefix}`
        );
      } else {
        this.sendMessage(msg.from.id, "Prefix tidak valid. Mohon coba lagi.");
      }
    });
  }

  /*
   ** TUGAS #5
   ** Explore functions yang ada
   */
  masihGatau() {
    // console.log("Masih bingung!");
  }
}

module.exports = Telebot;
