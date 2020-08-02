import React from 'react';

import { formatTimespan } from '../utils/formatting.js';
import { unHash } from '../utils/hashtagging.js';

const totalHours = (label, value) => (
    <div class="col-sm">
        <strong>{label}: </strong>
        <span>{formatTimespan(value)}</span>
    </div>
);

export default class Totals extends React.Component {
    render() {
        const hashtagTotalMapping = (tag) =>
            totalHours(unHash(tag), this.props.tags[tag]);

        return (
            <React.Fragment>
                {this.props.displayHelp
                    ? (<p>
                        Use #Hashtagged-Category-Names to categorize time entries.
                        The last entry doesn't count toward totals.
                    </p>)
                    : ""}
                <div class="row">
                    {totalHours(
                        "Total Uptime",
                        this.props.entries
                            .filter(x => !x.isBreak)
                            .map(x => x.elapsed)
                            .reduce((a, b) => (a || 0) + (b || 0), 0))}
                    {Object.keys(this.props.tags || []).sort().map(hashtagTotalMapping)}
                </div>
            </React.Fragment>
        );
    }
}
