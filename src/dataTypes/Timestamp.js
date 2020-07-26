const dateTo4DigitTime = value =>
    value.getHours() * 100 + value.getMinutes();
const timeIsValid = value =>
    value && !isNaN(value)
    && 0 <= parseInt(value) <= 2359
    && parseInt(value.slice(-2)) < 60;
const parseTime = value => parseInt(value);

export default class Timestamp {
    /**
     * @param {Date} timestamp 
     */
    constructor(timestamp) {
        this.date = new Date(
            timestamp.getFullYear(),
            timestamp.getMonth(),
            timestamp.getDate());
        this.time = dateTo4DigitTime(timestamp);
        this.sorttime = this.time;
        this.isMidEntry = false;
    }

    startEntry = () => this.setIsMidEntry(true);
    completeEntry = () => this.setIsMidEntry(false);

    renderTime = () => this.isMidEntry
        ? this.time.toString()
        : this.time.toString().padStart(4, "0");

    setIsMidEntry(value) {
        this.isMidEntry = value;
        if (!value) {
            this.sorttime = this.time;
        }
        return this;
    }

    setTime(value) {
        if (timeIsValid(value)) {
            this.time = parseTime(value);
        }
        return this;
    }
}
