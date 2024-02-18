/*
 ** TUGAS #4
 ** Pisahkan function
 */

 const commands = require("../libs/commands");

 async function handleMessage(data, sendMessage, invalidCommand) {
  const isCommands = Object.values(commands).some((keyword) =>
    keyword.test(data.text)
  );

  if (!isCommands) {
    console.log(
      `Invalid command executed by: ${data.from.username} => ${data.text}`
    );

    sendMessage(data.from.id, invalidCommand, {
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
}

async function handleCallbackQuery(callback, sendMessage, helpMessage) {
  const callbackName = callback.data;
  if (callbackName == "go_to_help") {
    sendMessage(callback.from.id, helpMessage);
  }
}

async function sendRandomQuoteHandler(data, sendMessage) {
  const quote_endpoint = process.env.QUOTE_ENDPOINT;
  try {
    console.log(`Random Quote executed by => ${data.from.username}`);
    const fetchQuote = await fetch(quote_endpoint);
    const { quote } = await fetchQuote.json();
    sendMessage(data.from.id, quote);
  } catch (err) {
    console.error(err);
    sendMessage(data.from.id, "Ada kesalahan saat pengambilan data.. 😢");
  }
}

async function sendNewsHandler(
  callback,
  sendMessage,
  sendPhoto,
  deleteMessage
) {
  const chatId = callback.from.id;
  console.log(`News executed by => ${callback.from.username}`);
  const news_endpoint = process.env.NEWS_ENDPOINT;
  const waitMsg = await sendMessage(chatId, "Mohon tunggu sebentar.. 🙏");
  try {
    const fetchNews = await fetch(news_endpoint);
    const res = await fetchNews.json();
    deleteMessage(chatId, waitMsg.message_id);
    for (let i = 0; i < 5; i++) {
      const { image, title, headline } = res.posts[i];
      sendPhoto(chatId, image, {
        caption: `===================\n${title}\n===================\n\n${headline}`,
      });
    }
  } catch (err) {
    console.error(err);
    sendMessage(chatId, "Error fetching news.");
  }
}

async function sendLatestEQHandler(
  callback,
  sendMessage,
  sendPhoto,
  deleteMessage
) {
  console.log(
    `Latest Earthquake Information executed by => ${callback.from.username}`
  );
  const eq_endpoint = process.env.EQ_ENDPOINT;
  const waitMsg = await sendMessage(
    callback.from.id,
    "Mohon tunggu sebentar.. 🙏"
  );
  try {
    const fetchEq = await fetch(eq_endpoint);
    const res = await fetchEq.json();
    const { gempa } = res.Infogempa;
    const { Wilayah, Magnitude, Tanggal, Jam, Kedalaman, Potensi, Shakemap } =
      gempa;
    deleteMessage(callback.from.id, waitMsg.message_id);

    const shakeMapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${Shakemap}`;

    sendPhoto(callback.from.id, shakeMapUrl, {
      caption: `Info Gempa Terbaru:\n${Tanggal} - ${Jam}\n\nWilayah: ${Wilayah}\nMagnitudo: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`,
    });
  } catch (err) {
    console.error(err);
  }
}

async function checkGenderHandler(data, after, sendMessage, deleteMessage) {
  console.log(`Check Gender executed by => ${data.from.username}`);
  const check_gender_endpoint = `${process.env.CHECK_GENDER_ENDPOINT}${after[1]}`;
  const waitMsg = await sendMessage(data.from.id, "Mohon tunggu sebentar.. 🙏");

  try {
    const fetchGender = await fetch(check_gender_endpoint);
    const res = await fetchGender.json();
    deleteMessage(data.chat.id, waitMsg.message_id);

    const capitalizedGender =
      res.gender.charAt(0).toUpperCase() + res.gender.slice(1);
    sendMessage(
      data.from.id,
      `Name: ${
        after[1]
      }\nGender: ${capitalizedGender}\nProbability: ${Math.round(
        res.probability * 100
      )}%`
    );
  } catch (err) {
    console.error(err);
    sendMessage(
      data.from.id,
      "Ada kesalahan saat melakukan request ke server, silahkan coba lagi.."
    );
  }
}

async function sendActivityHandler(callback, sendMessage, deleteMessage) {
  console.log(`Send Activity executed by => ${callback.from.username}`);
  const bored_endpoint = process.env.BORED_ENDPOINT;
  const waitMsg = await sendMessage(
    callback.from.id,
    "Mohon tunggu sebentar.. 🙏"
  );

  try {
    const fetchIp = await fetch(bored_endpoint);
    const { activity } = await fetchIp.json();
    deleteMessage(callback.from.id, waitMsg.message_id);

    sendMessage(callback.from.id, activity);
  } catch (err) {
    console.error(err);
    sendMessage(
      callback.from.id,
      "Ada kesalahan saat melakukan request ke server, silahkan coba lagi.."
    );
  }
}

async function sendJokeHandler(callback, sendMessage, deleteMessage) {
  console.log(`Send Joke executed by => ${callback.from.username}`);
  const joke_endpoint = process.env.JOKE_ENDPOINT;
  const waitMsg = await sendMessage(
    callback.from.id,
    "Mohon tunggu sebentar.. 🙏"
  );

  try {
    const fetchJoke = await fetch(joke_endpoint);
    const { setup, punchline } = await fetchJoke.json();
    deleteMessage(callback.from.id, waitMsg.message_id);
    sendMessage(callback.from.id, `${setup}\n${punchline}`);
  } catch (err) {
    console.error(err);
    sendMessage(
      callback.from.id,
      "Ada kesalahan saat melakukan request ke server, silahkan coba lagi.."
    );
  }
}

module.exports = {
  handleMessage,
  handleCallbackQuery,
  sendRandomQuoteHandler,
  sendNewsHandler,
  sendLatestEQHandler,
  checkGenderHandler,
  sendActivityHandler,
  sendJokeHandler,
};
