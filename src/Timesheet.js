import React from 'react';

export default class Timesheet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        };
    }
    render() {
        const list = this.state.entries.map((entry, index) => (
            <div class="input-group">
                <input type="text" class="form-control timestamp"
                    autoFocus
                    maxlength="4"
                    value={this.renderTime(entry.time)}
                    onChange={(event) => this.updateTime(index, event.target.value)} />
                <input type="text" class="form-control"
                    value={entry.summary}
                    onChange={(event) => this.updateSummary(index, event.target.value)} />
            </div>
        ));
        return (
            <div class="container">
                {list}
                <div class="input-group mt-2">
                    <button class="btn btn-secondary" type='button'
                        onClick={() => this.addEntry()}>
                            Add
                    </button>
                </div>
            </div>
        );
    }
    
    parseTime = value => parseInt(value);
    dateTo4DigitTime = value =>
        value.getHours() * 100 + value.getMinutes();
    renderTime = value => value.toString().padStart(4, "0");
    timeIsValid = value =>
        value && !isNaN(value)
        && 0 <= parseInt(value) <= 2359
        && parseInt(value.slice(-2)) < 60;
    
    updateTime = (index, value) =>
        this.doIfTrue(
            this.timeIsValid(value),
            () => this.updateEntry(index, "time", this.parseTime(value))
        );
    
    updateSummary = (index, value) =>
        this.updateEntry(index, "summary", value);
    
    doIfTrue(condition, func) {
        if (condition) {
            func();
        }
    }

    updateEntry(index, field, value) {
        let entries = this.state.entries;
        entries[index][field] = value;
        this.setState({entries});
    }

    addEntry() {
        let entries = this.state.entries;
        let timestamp = new Date();
        entries.push({
            date: new Date(
                timestamp.getFullYear(),
                timestamp.getMonth(),
                timestamp.getDate()),
            time: this.dateTo4DigitTime(timestamp),
            summary: ''
        });
        this.setState({entries});
    }
}
