import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Timestamp from './dataTypes/Timestamp.js';

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
                    value={entry.timestamp.renderTime()}
                    onChange={(event) => this.updateTime(index, event.target.value)}
                    onFocus={() => this.startTimeEntry(index)}
                    onBlur={() => this.completeTimeEntry(index)} />
                <input type="text" class="form-control"
                    value={entry.summary}
                    onChange={(event) => this.updateSummary(index, event.target.value)} />
                <div class="input-group-append">
                    <button class="btn btn-outline-danger" type="button"
                        title="Remove entry."
                        onClick={(e) => this.removeEntry(index)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
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
    
    startTimeEntry = (index) =>
        this.updateTimeProp(index, x => x.startEntry());
    
    completeTimeEntry = (index) =>
        this.updateTimeProp(index, x => x.completeEntry());
    
    updateTime = (index, value) =>
        this.updateTimeProp(index, x => x.setTime(value));
    
    updateTimeProp = (index, func) =>
        this.updateEntry(
            index,
            "timestamp",
             x => func(x.timestamp));

    updateSummary = (index, value) =>
        this.updateEntry(index, "summary", value);
    
    updateEntry(index, field, valueFunc) {
        if (typeof(valueFunc) !== "function") {
            const value = valueFunc;
            valueFunc = x => value;
        }
        let entries = this.state.entries;
        entries[index][field] = valueFunc(entries[index]);
        entries.sort((a, b) =>
            a.timestamp.sorttime - b.timestamp.sorttime);
        this.setState({entries});
    }

    addEntry() {
        let entries = this.state.entries;
        entries.push({
            timestamp: new Timestamp(new Date()),
            summary: ''
        });
        this.setState({entries});
    }

    removeEntry(index) {
        let entries = this.state.entries;
        entries.splice(index, 1);
        this.setState({entries});
    }
}
