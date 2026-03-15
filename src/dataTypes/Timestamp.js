import moment from 'moment';

import { dateFormatFieldString } from '../utils/formatting.js';

/**
 * Converts the hours and minutes of the given date into a single numeric value.
 * The time 12:00AM would translate to 0 and 11:59PM would translate to 2359.
 * @param {Date} value 
 * @returns {number} An integer in the form of `hhmm`, where `hh` is any number
 * between 0 and 23 and `mm` is any number between 0 and 59.
 */
const dateTo4DigitTime = value =>
    value.getHours() * 100 + value.getMinutes();

/**
 * Assuming a string at least two characters in length,
 * adds `:` at the 3rd position.
 * 
 * @param {string} value - The string to bisect. 
 */
const insertColon = (value) =>
    value.slice(0, 2) + ":" + value.slice(2);

/**
 * Assuming a numeric time (i.e. the output of `dateTo4DigitTime`),
 * pads the given value to 4 digits with leading zeroes.
 * @param {(number|string)} value - The value to pad to 
 * @returns {string}
 */
const pad = (value) => value.toString().padStart(4, "0");

/**
 * Determines whether the given value is a valid time
 * (i.e. the output of `dateTo4DigitTime`).
 * @param {number} value 
 * @returns {boolean}
 */
const timeIsValid = value =>
    value && !isNaN(value)
    && 0 <= parseInt(value)
    && parseInt(value) <= 2359
    && parseInt(value.slice(-2)) < 60;

/**
 * Converts a vanilla JS date to a Moment date, omitting time.
 * @param {Date} value
 */
const getDateFromDateObj = (value) =>
    moment(new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()));

/**
 * A specific date and time used in time entry.
 */
export default class Timestamp {
    /**
     * @param {(Date | {
     *      date: moment.Moment,
     *      time: number,
     *      sortdate: moment.Moment,
     *      sorttime: number
     *  })} timestamp 
     */
    constructor(timestamp) {
        if (timestamp instanceof Date) {
            /**
             * The date portion of the timestamp.
             * @type {moment.Moment} 
             */
            this.date = getDateFromDateObj(timestamp);

            /**
             * A raw numeric value representing the time of the timestamp.
             * @type {number}
             */
            this.time = dateTo4DigitTime(timestamp);

            /**
             * The date to use for sorting purposes.
             * Remains stable during data entry.
             * @type {moment.Moment} 
             */
            this.sortdate = this.date;

            /**
             * The time to use for sorting purposes.
             * Remains stable during data entry.
             * @type {number}
             */
            this.sorttime = this.time;

            /**
             * Indicates whether data entry is in progress.
             * Do not change directly or bad things can happen.
             * @type {boolean}
             */
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

    /**
     * Converts this Timestamp to an object containing essential data,
     * omitting functions.
     * @returns 
     */
    toObject = () => {
        return {
            date: this.sortdate,
            time: this.sorttime,
            sortdate: this.sortdate,
            sorttime: this.sorttime
        };
    }

    /**
     * Gets a Moment date/time for sorting purposes.
     * @returns 
     */
    getSortable() {
        const timestring = pad(this.sorttime);
        const hours = parseInt(timestring.slice(0, 2));
        const minutes = parseInt(timestring.slice(2)) + (hours * 60);
        return moment(this.sortdate).add(minutes, 'm');
    }

    /**
     * Signals to the Timestamp object that data entry is in progress.
     * Returns the object for function chaining.
     * @returns {this}
     */
    startEntry = () => this.setIsMidEntry(true);

    /**
     * Signals to the Timestamp object that data entry has stopped.
     * Returns the object for function chaining.
     * @returns {this}
     */
    completeEntry = () => this.setIsMidEntry(false);

    /**
     * Gets the timestamp's date part formatted as a string.
     * @returns 
     */
    renderDate = () => this.date.format(dateFormatFieldString);

    /**
     * Gets the timestamp's time part formatted as a string.
     * Appearance may vary depending on whether data entry is in progress
     * or depending on given options.
     * @param {{insertColon: boolean}} options - Rendering options for the timestamp.
     * @returns 
     */
    renderTime = (options) => this.isMidEntry
        ? this.time.toString()
        : options && options.includeColon
            ? insertColon(pad(this.time))
            : pad(this.time);

    /**
     * Signals to the Timestamp object whether or not data entry is in progress.
     * Returns the object for function chaining.
     * @param {boolean} value 
     * @returns {this}
     */
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

    /**
     * Sets the timestamp's date part using the given value.
     * Returns the object for function chaining.
     * @param {(Date | moment.MomentInput)} value 
     * @returns {this}
     */
    setDate(value) {
        if (value instanceof Date) {
            this.date = getDateFromDateObj(value);
        } else {
            this.date = moment(value);
        }
        return this;
    }

    /**
     * Sets the timestamp's time part using the given value.
     * If no value is given, sets the time to midnight.
     * Returns the object for function chaining.
     * @param {?number} value 
     * @returns 
     */
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
