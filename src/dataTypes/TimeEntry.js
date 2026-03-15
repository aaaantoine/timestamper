import React from 'react';

// For JSDoc.
// eslint-disable-next-line
import Timestamp from './Timestamp.js';

/**
 * A time entry, part of a full timesheet.
 */
export class TimeEntry {
    /**
     * Initializes a new instance of the `TimeEntry` class.
     * @param {{timestamp: Timestamp, summary: string, isBreak: boolean}} props -
     * An object containing parameters to create a new `TimeEntry`.
     */
    constructor(props) {
        /**
         * A time stamp reflecting the date, hour, and minute of the entry.
         * @type {Timestamp}
         */
        this.timestamp = props?.timestamp;

        /**
         * A description for the time entry.
         * @type {string}
         */
        this.summary = props?.summary;

        /**
         * Indicates whether to track the time following this entry.
         * In the context of a time sheet, setting `true` makes this entry
         * indicate the stop time of the previous task.
         * @type {boolean}
         */
        this.isBreak = !!props?.isBreak;

        /**
         * The number of milliseconds elapsed between this time entry and the
         * next entry in a timesheet.
         * @see {Timesheet.calculateTimeElapsed}
         * @type {?number}
         */
        this.elapsed = null;

        /**
         * A React reference for the timestamp.
         * @type {React.RefObject<any>}
         */
        this.timestampRef = React.createRef();

        /**
         * A React reference for the summary.
         * @type {React.RefObject<any>}
         */
        this.summaryRef = React.createRef();
    }
}

/**
 *  Indicates whether the given item is a valid `TimeEntry`.
 *  @param {*} val - The item to evaluate.
 *  @returns {boolean} `true` if it looks like a `TimeEntry` or is close enough,
 *      otherwise `false`.
 */
export function isTimeEntry(val) {
    if (!val) {
        return false;
    }

    const classProps = Object.getOwnPropertyNames(new TimeEntry());
    const valProps = Object.getOwnPropertyNames(val);
    return classProps.every(prop => valProps.includes(prop));
}
