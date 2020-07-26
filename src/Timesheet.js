import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus, faPause, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Timestamp from './dataTypes/Timestamp.js';

export default class Timesheet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        };
    }
    render() {
        const rowClass = entry =>
            "input-group"
            + (entry.isBreak ? " break-entry" : "");
        const resumeButton = (entry, index, isLast) => isLast
            ? ""
            : (
                <button class="btn btn-outline-secondary" type="button"
                        title="Add a new entry to resume this task."
                        onClick={e => this.resumeEntry(index)}>
                    <FontAwesomeIcon icon={faPlay} />
                </button>
            );
        const list = this.state.entries.map((entry, index) => (
            <div class={rowClass(entry)}>
                <input type="text" class="form-control timestamp"
                    ref={entry.timestampRef}
                    autoFocus
                    maxlength="4"
                    value={entry.timestamp.renderTime()}
                    onChange={(event) => this.updateTime(index, event.target.value)}
                    onFocus={() => this.startTimeEntry(index)}
                    onBlur={() => this.completeTimeEntry(index)}
                    onKeyDown={(event) => this.arrowKeyFocus(index, event, "timestamp")} />
                <input type="text" class="form-control"
                    ref={entry.summaryRef}
                    value={entry.summary}
                    onChange={(event) => this.updateSummary(index, event.target.value)}
                    onKeyDown={(event) => this.arrowKeyFocus(index, event, "summary")} />
                <div class="input-group-append">
                    {resumeButton(entry, index, index === this.state.entries.length - 1)}
                    <button class="btn btn-outline-secondary" type="button"
                        title="Toggle break."
                        onClick={e => this.updateIsBreak(index)}>
                            <FontAwesomeIcon icon={faPause} />
                        </button>
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
                <div class="mt-2">
                    <button class="btn btn-primary" type='button'
                        title="Add an entry."
                        onClick={() => this.addEntry()}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button> 
                    <button class="btn btn-secondary ml-1" type="button"
                        title="Take a break."
                        onClick={(e) => this.addEntry("Break", true)}>
                        <FontAwesomeIcon icon={faPause} />
                    </button>
                </div>
            </div>
        );
    }
    
    arrowKeyFocus(index, event, field) {
        let newIndex = index;
        if (event.keyCode === 38) { // up
            if (index <= 0) return;
            newIndex -= 1;
        }
        else if (event.keyCode === 40 || event.keyCode === 13) { // down or enter
            if (index >= this.state.entries.length - 1) {
                // only add if the last entry has text
                if (this.state.entries[index].summary.trim() !== "") {
                    this.addEntry();
                }
                return;
            }
            newIndex += 1;
        }
        else {
            return;
        }
        this.state.entries[newIndex][field + "Ref"].current.focus();
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
    
    updateIsBreak = (index) =>
        this.updateEntry(index, "isBreak", x => !x.isBreak);

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

    resumeEntry(index) {
        const resumeText = "Resume ";
        var sourceEntry = this.state.entries[index];
        var text = sourceEntry.summary;
        text = !text.startsWith(resumeText) ? resumeText + text : text;
        this.addEntry(text, sourceEntry.isBreak);
    }

    addEntry(text, isBreak) {
        if (!text) {
            text = '';
        }
        let entries = this.state.entries;
        entries.push({
            timestamp: new Timestamp(new Date()),
            summary: text,
            isBreak: !!isBreak,

            timestampRef: React.createRef(),
            summaryRef: React.createRef()
        });
        this.setState({entries});
    }

    removeEntry(index) {
        let entries = this.state.entries;
        entries.splice(index, 1);
        this.setState({entries});
    }
}
