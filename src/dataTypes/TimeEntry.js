import React from 'react';

export class TimeEntry {
    constructor(props) {
        this.timestamp = props?.timestamp;
        this.summary = props?.summary;
        this.isBreak = !!props?.isBreak;
        this.timestampRef = React.createRef();
        this.summaryRef = React.createRef();
    }
}

export function isTimeEntry(val) {
    if (!val) {
        return false;
    }

    const classProps = Object.getOwnPropertyNames(new TimeEntry);
    const valProps = Object.getOwnPropertyNames(val);
    return classProps.every(prop => valProps.includes(prop));
}
