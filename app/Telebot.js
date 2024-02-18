const TelegramBot = require("node-telegram-bot-api");
const commands = require("../libs/commands");
const { helpMessage, invalidCommand } = require("../libs/constant");

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
      this.sendMessage(data.from.id, "Halo juga 😜");
    });
  }

  // Bot will reply sender's sticker with the actual emoji
  sendSticker() {
    this.on("sticker", (data) => {
      this.sendMessage(data.from.id, data.sticker.emoji);
    });
  }

  // Bot will follow sender's message
  followMe() {
    this.onText(commands.follow, (data, after) => {
      this.sendMessage(data.from.id, `Kamu baru saja mengetik:${after[1]}`);
    });
  }

  // Bot will send random Kanye West's quote
  getRandQuote() {
    this.onText(commands.quote, async (data) => {
      const quote_endpoint = process.env.QUOTE_ENDPOINT;
      try {
        const fetchQuote = await fetch(quote_endpoint);
        const { quote } = await fetchQuote.json();
        this.sendMessage(data.from.id, quote);
      } catch (err) {
        console.error(err);
        this.sendMessage(
          data.from.id,
          "Ada kesalahan saat pengambilan data.. 😢"
        );
      }
    });
  }

  // Bot will send latest news from Jakpost API
  getNews() {
    this.onText(commands.news, async (data) => {
      const news_endpoint = process.env.NEWS_ENDPOINT;
      const waitMsg = await this.sendMessage(
        data.from.id,
        "Mohon tunggu sebentar.. 🙏"
      );
      try {
        const fetchNews = await fetch(news_endpoint);
        const res = await fetchNews.json();
        this.deleteMessage(data.chat.id, waitMsg.message_id);
        for (let i = 0; i < 2; i++) {
          const { image, title, headline } = res.posts[i];
          this.sendPhoto(data.from.id, image, {
            caption: `===================\n${title}\n===================\n\n${headline}`,
          });
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Get Latest Indonesia Earthquake from BMKG
  getLatestEQ() {
    this.onText(commands.eq, async (data) => {
      const eq_endpoint = process.env.EQ_ENDPOINT;
      const waitMsg = await this.sendMessage(
        data.from.id,
        "Mohon tunggu sebentar.. 🙏"
      );
      try {
        const fetchEq = await fetch(eq_endpoint);
        const res = await fetchEq.json();
        const { gempa } = res.Infogempa;
        const {
          Wilayah,
          Magnitude,
          Tanggal,
          Jam,
          Kedalaman,
          Potensi,
          Shakemap,
        } = gempa;
        this.deleteMessage(data.chat.id, waitMsg.message_id);

        const shakeMapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${Shakemap}`;

        this.sendPhoto(data.from.id, shakeMapUrl, {
          caption: `Info Gempa Terbaru:\n${Tanggal} - ${Jam}\n\nWilayah: ${Wilayah}\nMagnitudo: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`,
        });
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Show help commnads
  showHelp() {
    this.onText(commands.help, (data) => {
      this.sendMessage(data.from.id, helpMessage);
    });
  }
}

module.exports = Telebot;
