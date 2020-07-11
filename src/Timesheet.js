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
                    maxlength="4"
                    value={entry.time}
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
    renderTime = value => value.getHours() * 100 +
        value.getMinutes();
    
    updateTime = (index, value) =>
        this.updateEntry(index, "time", this.parseTime(value));
    
    updateSummary = (index, value) =>
        this.updateEntry(index, "summary", value);

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
            time: this.renderTime(timestamp),
            summary: ''
        });
        this.setState({entries});
    }
}
