require('dotenv').config();

const DateTime = {
    localTimeZone: new Date().getTimezoneOffset(),
    localTimeZoneUtc: `${this.localTimeZone > 0 ? '-' : '+'}${Math.abs(this.localTimeZone)/60 < 10 ? `0${Math.abs(this.localTimeZone)/60}` : Math.abs(this.localTimeZone)/60}:00`,

    dateTimeFormat: {
        dateFormat: null,
        timeFormat: null,
    },

    dateFormat: 'DD/MM/YYYY',
    dateFormatProperty: null,
    dateFormats: [
        {format: 'DD.MM.YYYY', db: '%d.%m.%Y', pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$', demo: '09.05.2024'},
        {format: 'DD/MM/YYYY', db: '%d/%m/%Y', pattern: '^\\d{2}/\\d{2}/\\d{4}$',     demo: '09/05/2024'},
        {format: 'DD-MM-YYYY', db: '%d-%m-%Y', pattern: '^\\d{2}-\\d{2}-\\d{4}$',     demo: '09-05-2024'},
    ],

    timeFormat: 'hh:mm:ss A',
    timeFormatProperty: null,
    timeFormats: [
        {format: 'hh:mm A',    db: '%h:%i %p',    pattern: '^((0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM))$',              demo: '01:37 PM'},
        {format: 'hh:mm:ss A', db: '%h:%i:%s %p', pattern: '^((0?[1-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (AM|PM))$', demo: '01:37:25 PM'},
        {format: 'HH:mm',      db: '%h:%i',       pattern: '^((0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]))$',               demo: '13:37'},
        {format: 'HH:mm:ss',   db: '%H:%i:%s',    pattern: '^((0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))$',  demo: '13:37:25'}
    ],

    __init: async () => {
        DateTime.localTimeZone = new Date().getTimezoneOffset();
        DateTime.localTimeZoneUtc = await DateTime.formatTimeZone(DateTime.localTimeZone);
        console.log(DateTime.localTimeZoneUtc);
        DateTime.dateTimeFormat.dateFormat = DateTime.dateFormats.find(format => format.format === DateTime.dateFormat);
        DateTime.dateTimeFormat.timeFormat = DateTime.timeFormats.find(format => format.format === DateTime.timeFormat);
        DateTime.dateFormatProperty = DateTime.dateFormats.find(format => format.format === DateTime.dateFormat);
        DateTime.timeFormatProperty = DateTime.timeFormats.find(format => format.format === DateTime.timeFormat);
    },

    formatTimeZone: async (offset) => {
        const sign = offset > 0 ? '-' : '+';
        const hours = Math.abs(Math.floor(offset / 60));
        const minutes = Math.abs(offset % 60);
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${sign}${formattedHours}:${formattedMinutes}`;
    },

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
        date = new Date(date.getTime() + DateTime.localTimeZone * 60 * 1000);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },

    dbConvertFormatAndTz: (field) => {
        return `DATE_FORMAT(CONVERT_TZ(${field}, '+00:00', '${DateTime.localTimeZoneUtc}'), '${DateTime.dateFormatProperty.db} ${DateTime.timeFormatProperty.db}')`;
    },

    convertToDisplay: async (inputDateTime) => {

    },
}

DateTime.__init();

global.DateTime = DateTime;