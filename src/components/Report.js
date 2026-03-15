import React from 'react';

import { dateHeader } from './header.js';

import { formatTimespan } from '../utils/formatting.js';
import { hashtagRegex, unHash } from '../utils/hashtagging.js';

// For JSDoc.
// eslint-disable-next-line
import { TimeEntry } from '../dataTypes/TimeEntry.js';

/**
 * Renders a time entry summary for copy mode.
 * @param {string} summary
 */
const copyModeSummary = summary =>
    summary
        .replace(hashtagRegex, x => `|${x}|`)
        .split("|")
        .map(x =>
            x.match(hashtagRegex)
                ? (<strong>{unHash(x)}</strong>)
                : (<React.Fragment>{x}</React.Fragment>));

/**
 * Produces a text rendition of the given time entry's elapsed time. 
 * @param {TimeEntry} entry 
 */
const timeElapsedText = (entry) =>
    entry.elapsed
        ? "(" + formatTimespan(entry.elapsed) + ")"
        : "";

export default class Report extends React.Component {
    render() {
        /**
         * Renders a given time entry for copy mode.
         * @param {TimeEntry} entry 
         * @param {number} index 
         */
        const copyModeMapping = (entry, index) => (
            <React.Fragment>
                {dateHeader(this.props.entries, index, "row")}    
                <div class={"row p-1" + (entry.isBreak ? " break-entry" : "")}>
                    <span class="col-xs-1">
                        {entry.timestamp.renderTime({includeColon: true})}
                    </span>
                    <span> </span>
                    <span class="col">
                        {copyModeSummary(entry.summary)}
                    </span>
                    <span> </span>
                    <span class="col-xs-2 elapsed-time">
                        {timeElapsedText(entry)}
                    </span>
                </div>
            </React.Fragment>
        );

        return this.props.entries.map(copyModeMapping); 
    }
}
