function parseMessage(messageText) {
    const datePattern = /О (\d{2}:\d{2})/;
    const actionPattern = /(В(ідключаємо|имикаємо|ключаємо|микаємо) 2 групу|2 група залишається відключеною)/;

    const dateMatch = messageText.match(datePattern);
    const actionMatch = messageText.match(actionPattern);

    if (dateMatch && actionMatch) {
        let status = 'off';
        if (actionMatch[1].includes('Вмикаємо') || actionMatch[1].includes('Включаємо')) {
            status = 'on';
        } else if (actionMatch[1].includes('залишається відключеною')) {
            status = 'off';
        }

        return {
            isChanged: true,
            date: `О ${dateMatch[1]}`,
            action: actionMatch[1],
            status: status,
        };
    }
    return null;
}

module.exports = parseMessage;
