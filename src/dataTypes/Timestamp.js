const dateTo4DigitTime = value =>
    value.getHours() * 100 + value.getMinutes();
const insertColon = (value) =>
    value.slice(0, 2) + ":" + value.slice(2);
const pad = (value) => value.toString().padStart(4, "0");
const timeIsValid = value =>
    value && !isNaN(value)
    && 0 <= parseInt(value)
    && parseInt(value) <= 2359
    && parseInt(value.slice(-2)) < 60;

export default class Timestamp {
    /**
     * @param {Date} timestamp 
     */
    constructor(timestamp) {
        if (timestamp instanceof Date) {
            this.date = new Date(
                timestamp.getFullYear(),
                timestamp.getMonth(),
                timestamp.getDate());
            this.time = dateTo4DigitTime(timestamp);
            this.sorttime = this.time;
            this.isMidEntry = false;
        }
        else {
            this.date = new Date(timestamp.date);
            this.time = timestamp.time;
            this.sorttime = timestamp.sorttime;
            this.setIsMidEntry(false);
        }
    }

    toObject = () => {
        return {
            date: this.date,
            time: this.time,
            sorttime: this.sorttime
        };
    }

    getSortable() {
        const timestring = pad(this.sorttime);
        const hours = parseInt(timestring.slice(0, 2));
        const minutes = parseInt(timestring.slice(2)) + (hours * 60);
        return new Date(this.date.getTime() + minutes * 60000);
    }

    startEntry = () => this.setIsMidEntry(true);
    completeEntry = () => this.setIsMidEntry(false);

    renderTime = (options) => this.isMidEntry
        ? this.time.toString()
        : options && options.includeColon
            ? insertColon(pad(this.time))
            : pad(this.time);

    setIsMidEntry(value) {
        this.isMidEntry = value;
        if (!value) {
            if (timeIsValid(this.time.toString())) {
                this.sorttime = this.time;
            } else {
                this.time = this.sorttime;
            }
        }
        return this;
    }

    setTime(value) {
        if (!value) {
            value = 0;
        }
        if (!isNaN(value)) {
            this.time = parseInt(value);
        }
        return this;
    }
}
