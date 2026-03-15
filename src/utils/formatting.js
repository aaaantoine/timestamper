/**
 * Formats a given numeric milliseconds count as fractional hours
 * (i.e. `4500000` -> `'1.25h'`).
 * @param {number} timespan - A timespan expressed as milliseconds.
 */
export const formatTimespan = (timespan) =>
    (timespan / 1000 / 60 / 60).toFixed(2) + "h";

/**
 * Common format for rendering a date.
 */
export const dateFormatString = "YYYY-MM-DD dddd";

/**
 * Common format for a date field value, i.e.
 * `<input type="date" value="2023-01-23" />`.
 */
export const dateFormatFieldString = "YYYY-MM-DD";
