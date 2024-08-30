function parseMessage(messageText) {
    const datePattern = /О (\d{2}:\d{2})/;
    const actionPattern = /(В(ідключаємо|имикаємо|ключаємо|микаємо) \d+ групу)/;

    const dateMatch = messageText.match(datePattern);
    const actionMatch = messageText.match(actionPattern);

    if (dateMatch && actionMatch) {
        const isOff = actionMatch[1].includes('В(ідключаємо|имикаємо)');
        const isOn = actionMatch[1].includes('В(ключаємо|микаємо)');

        return {
            isChanged: true,
            date: dateMatch ? `О ${dateMatch[1]}` : null,
            action: actionMatch[1],
            isOff: isOff ? true : undefined,
            isOn: isOn ? true : undefined,
        };
    }
    return null;
}
