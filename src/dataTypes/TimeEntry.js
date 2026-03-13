import React from 'react';

export default class TimeEntry {
    constructor({ timestamp, summary, isBreak }) {
        this.timestamp = timestamp;
        this.summary = summary;
        this.isBreak = !!isBreak;
        this.timestampRef = React.createRef();
        this.summaryRef = React.createRef();
    }
}
