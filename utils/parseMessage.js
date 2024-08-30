function parseMessage(messageText) {
    const datePattern = /О (\d{2}:\d{2})/;
    const actionPattern = /(Відключаємо 2 групу|Включаємо 2 групу)/;

    const dateMatch = messageText.match(datePattern);
    const actionMatch = messageText.match(actionPattern);

    if (dateMatch && actionMatch) {
        const isOff = actionMatch[1].includes('Відключаємо');
        const isOn = actionMatch[1].includes('Включаємо');

        return {
            isChanged: true,
            date: `О ${dateMatch[1]}`,
            action: actionMatch[1],
            isOff: isOff ? true : undefined,
            isOn: isOn ? true : undefined,
        };
    }
    return null;
}

module.exports = parseMessage;
