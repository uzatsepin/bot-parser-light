const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { Bot } = require('grammy');
const fs = require('fs');
const input = require('input');
const parseMessage = require("./utils/parseMessage");
const dotenv = require('dotenv').config();

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const sessionFile = './session.json';

const botToken = process.env.BOT_API
const chatId = process.env.CHAT_ID

const bot = new Bot(botToken);

function loadSession() {
    if (fs.existsSync(sessionFile)) {
        const sessionData = fs.readFileSync(sessionFile, 'utf-8');
        return new StringSession(sessionData);
    }
    return new StringSession('');
}

function saveSession(session) {
    fs.writeFileSync(sessionFile, session.save(), 'utf-8');
}

(async () => {
    console.log('Loading interactive example...');
    const stringSession = loadSession();
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text('Please enter your number: '),
        password: async () => await input.text('Please enter your password: '),
        phoneCode: async () => await input.text('Please enter the code you received: '),
        onError: (err) => console.log(err),
    });

    console.log('You should now be connected.');

    saveSession(client.session);

    const channel = '@esvitlo_kyiv_ua';

    const initialMessages = await client.getMessages(channel, {
        limit: 1,
    });

    let lastMessageId = initialMessages.length > 0 ? initialMessages[0].id : 0;

    const checkNewMessages = async () => {
        const result = await client.getMessages(channel, {
            limit: 5,
        });

        for (const message of result.reverse()) {
            if (message.id > lastMessageId) {
                const parsedMessage = parseMessage(message.text);
                if (parsedMessage) {
                    console.log(`Parsed Message:`, parsedMessage);

                    await bot.api.sendMessage(chatId, `${parsedMessage.status === 'on' ? `💡 ${parsedMessage.date} \n\n🟢 ${parsedMessage.action}` : `🕯️ ${parsedMessage.date} \n\n🔴 ${parsedMessage.action}`} \n\n<blockquote>ℹ️ Повернення та відключення світла займає від кількох хвилин до години.</blockquote>`, {
                        parse_mode: "HTML"
                    });
                }
                lastMessageId = message.id;
            }
        }
        console.log(`${Date.now()} message checked, interval worked`);
    };

    setInterval(checkNewMessages, 5 * 60 * 1000);
})();
