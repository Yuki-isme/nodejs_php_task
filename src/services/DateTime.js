require('dotenv').config();

const DateTime = {
    // timeZoneName: `${process.env.TIME_ZONE_NAME}`,
    // timeZone: `${process.env.TIME_ZONE}`,
    // timeZoneLocal: new Date().getTimezoneOffset(),

    dateFormat: 'DD/MM/YYYY',
    dateFormats: [
        {format: 'DD.MM.YYYY', db: '%d.%m.%Y', demo: '09.05.2024'},
        {format: 'DD/MM/YYYY', db: '%d/%m/%Y', demo: '09/05/2024'},
        {format: 'DD-MM-YYYY', db: '%d-%m-%Y', demo: '09-05-2024'},
    ],

    timeFormat: 'hh:mm:ss A',
    timeFormats: [
        {format: 'hh:mm A',    db: '%h:%i %p', demo: '01:37 PM'},
        {format: 'hh:mm:ss A', db: '%h:%i:%s %p', demo: '01:37:25 PM'},
        {format: 'HH:mm',      db: '%h:%i', demo: '13:37'},
        {format: 'HH:mm:ss',   db: '%H:%i:%s', demo: '13:37:25'}
    ],

    initDate: (inputDateTime) => {
        let dateTime = inputDateTime.split(' ');
        let dateParts = dateTime[0];
        let timeParts = dateTime[1];

        let formatPartsDate = DateTime.dateFormat.split(/[\-.\/]/);
        dateParts = dateParts.split(/[\-.\/]/);

        let yearIndex = formatPartsDate.findIndex(part => part.toLowerCase().includes('y'));
        let monthIndex = formatPartsDate.findIndex(part => part.toLowerCase().includes('m'));
        let dayIndex = formatPartsDate.findIndex(part => part.toLowerCase().includes('d'));

        let year = parseInt(dateParts[yearIndex], 10);
        let month = parseInt(dateParts[monthIndex], 10) - 1;
        let day = parseInt(dateParts[dayIndex], 10);

        let date = new Date(year, month, day);

        if (typeof timeParts !== 'undefined') {
            timeParts = timeParts.split(':');
            let hour = parseInt(timeParts[0], 10);
            let minute = parseInt(timeParts[1], 10);
            let second = DateTime.timeFormat.includes('ss') ? parseInt(timeParts[2], 10) : 0;

            hour += DateTime.timeFormat.includes('A') && dateTime[2] === 'PM' ? 12 : 0;

            date.setHours(hour, minute, second);
        }

        return date;
    },

    convertToDb: async (inputDateTime) => {
        let date = await DateTime.initDate(inputDateTime);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },

    convertToDisplay: async (inputDateTime) => {

    },
}

module.exports = DateTime;