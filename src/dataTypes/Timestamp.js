import moment from 'moment';

import { dateFormatFieldString } from '../utils/formatting.js';

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

const getDateFromDateObj = (value) =>
    moment(new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()));

export default class Timestamp {
    /**
     * @param {Date} timestamp 
     */
    constructor(timestamp) {
        if (timestamp instanceof Date) {
            this.date = getDateFromDateObj(timestamp);
            this.time = dateTo4DigitTime(timestamp);
            this.sortdate = this.date;
            this.sorttime = this.time;
            this.isMidEntry = false;
        }
        else {
            this.date = moment(new Date(timestamp.date));
            this.time = timestamp.time;
            this.sortdate = moment(new Date(timestamp.sortdate));
            this.sorttime = timestamp.sorttime;
            this.setIsMidEntry(false);
        }
    }

    toObject = () => {
        return {
            date: this.sortdate,
            time: this.sorttime,
            sortdate: this.sortdate,
            sorttime: this.sorttime
        };
    }

    getSortable() {
        const timestring = pad(this.sorttime);
        const hours = parseInt(timestring.slice(0, 2));
        const minutes = parseInt(timestring.slice(2)) + (hours * 60);
        return moment(this.sortdate).add(minutes, 'm');
    }

    startEntry = () => this.setIsMidEntry(true);
    completeEntry = () => this.setIsMidEntry(false);

    renderDate = () => this.date.format(dateFormatFieldString);

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
            
            if (this.date.isValid()) {
                this.sortdate = this.date;
            } else {
                this.date = this.sortdate;    
            }
        }
        return this;
    }

    setDate(value) {
        if (value instanceof Date) {
            this.date = getDateFromDateObj(value);
        } else {
            this.date = moment(value);
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
