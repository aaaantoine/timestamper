var dateTo4DigitTime = value =>
    value.getHours() * 100 + value.getMinutes();

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
    }

    timeIsValid = value =>
        value && !isNaN(value)
        && 0 <= parseInt(value) <= 2359
        && parseInt(value.slice(-2)) < 60;
    parseTime = value => parseInt(value);
    renderTime = () => this.time.toString().padStart(4, "0");
    setTime(value) {
        if (this.timeIsValid(value)) {
            this.time = this.parseTime(value);
        }
        return this;
    }
}
