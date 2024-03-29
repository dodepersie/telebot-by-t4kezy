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
              text: "User Guide",
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

async function sendRandomQuoteHandler(callback, sendMessage, deleteMessage) {
  const chatId = callback.from.id
  const quote_endpoint = process.env.QUOTE_ENDPOINT;
  console.log(`Random Quote executed by => ${callback.from.username}`);
  const waitMsg = await sendMessage(chatId, "Please wait a second.. 🙏");
  try {
    const fetchQuote = await fetch(quote_endpoint);
    const { quote, anime, character } = await fetchQuote.json();
    deleteMessage(chatId, waitMsg.message_id);
    sendMessage(callback.from.id, `${quote}\n\n— ${character} from ${anime}`);
  } catch (err) {
    console.error(err);
    sendMessage(callback.from.id, "Error fetching quote.. 😢");
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
  const waitMsg = await sendMessage(chatId, "Please wait a second.. 🙏");
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
    sendMessage(chatId, "Error fetching news.. 😢");
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
    "Please wait a second.. 🙏"
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
      caption: `Latest Earthquake Information:\n${Tanggal} - ${Jam}\n\nArea: ${Wilayah}\nMagnitude: ${Magnitude} SR\nDepth: ${Kedalaman}\nPotention: ${Potensi}`,
    });
  } catch (err) {
    console.error(err);
    sendMessage(chatId, "Error fetching latest earthquake information.. 😢");
  }
}

async function checkGenderHandler(data, after, sendMessage, deleteMessage) {
  console.log(`Check Gender executed by => ${data.from.username}`);
  const check_gender_endpoint = `${process.env.CHECK_GENDER_ENDPOINT}${after[1]}`;
  const waitMsg = await sendMessage(data.from.id, "Please wait a second.. 🙏");

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
    sendMessage(data.from.id, "Error fetching gender information.. 😢");
  }
}

async function sendActivityHandler(callback, sendMessage, deleteMessage) {
  console.log(`Send Activity executed by => ${callback.from.username}`);
  const bored_endpoint = process.env.BORED_ENDPOINT;
  const waitMsg = await sendMessage(
    callback.from.id,
    "Please wait a second.. 🙏"
  );

  try {
    const fetchIp = await fetch(bored_endpoint);
    const { activity } = await fetchIp.json();
    deleteMessage(callback.from.id, waitMsg.message_id);

    sendMessage(callback.from.id, `Activity suggestion => ${activity}`);
  } catch (err) {
    console.error(err);
    sendMessage(callback.from.id, "Error fetching activity.. 😢");
  }
}

async function sendJokeHandler(callback, sendMessage, deleteMessage) {
  console.log(`Send Joke executed by => ${callback.from.username}`);
  const joke_endpoint = process.env.JOKE_ENDPOINT;
  const waitMsg = await sendMessage(
    callback.from.id,
    "Please wait a second.. 🙏"
  );

  try {
    const fetchJoke = await fetch(joke_endpoint);
    const { setup, punchline } = await fetchJoke.json();
    deleteMessage(callback.from.id, waitMsg.message_id);
    sendMessage(callback.from.id, `${setup}\n${punchline}`);
  } catch (err) {
    console.error(err);
    sendMessage(callback.from.id, "Error fetching joke.. 😢");
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
