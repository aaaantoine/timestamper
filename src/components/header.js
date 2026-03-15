import { dateFormatString } from '../utils/formatting.js'

// For JSDoc.
// eslint-disable-next-line
import { TimeEntry } from '../dataTypes/TimeEntry.js'

/**
 * Renders a simple header.
 * @param {string} text - The header text.
 * @param {?string} className - Appends to the header element's CSS classes.
 */
export const header = (text, className) => (
    <div className={"border-bottom mt-4 mb-2 " + className}>
        <small>{text}</small>
    </div>
);

/**
 * Renders a date header over a given entry if the date is different from the
 * previous entry. 
 * @param {TimeEntry[]} entries - The set of time entries involved.
 * @param {number} index - The index of the entry to render a header over.
 * @param {?string} className - Appends to the header element's CSS classes.
 */
export const dateHeader = (entries, index, className) =>
    index === 0 || !entries[index - 1].timestamp.sortdate.isSame(entries[index].timestamp.sortdate)
        ? header(
            entries[index].timestamp.sortdate.format(dateFormatString),
            className)
        : "";
