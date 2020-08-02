import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faPlay, faPlus, faPause, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Timestamp from './dataTypes/Timestamp.js';

const timeDiff = (timestampA, timestampB) =>
    timestampB.getSortable() - timestampA.getSortable();

const formatTimespan = (timespan) =>
        (timespan / 1000 / 60 / 60).toFixed(2) + "h";

const hashtagRegex = /#[\w-]+/g;

const findHashtagEntries = entries => 
    entries.filter(x => x.summary.search(hashtagRegex) >= 0);

const getHashtags = text => text.match(hashtagRegex);

const unHash = text => text.replace(/#/, "").replace(/-/g, " ");

export default class Timesheet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: this.loadEntries(),
            isCopyMode: false,
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
        const timeElapsedText = (entry, index) =>
            entry.elapsed
                ? "(" + formatTimespan(entry.elapsed) + ")"
                : "";
        const header = (text, className) => (
            <div class={"border-bottom mt-4 mb-2 " + className}>
                <small>{text}</small>
            </div>
        );
        const dateHeader = (entry, index, className) =>
            index === 0 || !this.state.entries[index - 1].timestamp.date.isSame(entry.timestamp.date)
                ? header(
                    entry.timestamp.date.format("YYYY-MM-DD dddd"),
                    className)
                : "";
        const editModeMapping = (entry, index) => (
            <React.Fragment>
                {dateHeader(entry, index)}
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
                        <button class={"btn " + (entry.isBreak ? "btn-secondary" : "btn-outline-secondary")} type="button"
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
            </React.Fragment>
        );
        const copyModeMapping = (entry, index) => (
            <React.Fragment>
                {dateHeader(entry, index, "row")}    
                <div class={"row p-1" + (entry.isBreak ? " break-entry" : "")}>
                    <span class="col-xs-1">
                        {entry.timestamp.renderTime({includeColon: true})}
                    </span>
                    <span> </span>
                    <span class="col">
                        {entry.summary.replace(hashtagRegex, x => unHash(x))}
                    </span>
                    <span> </span>
                    <span class="col-xs-2 elapsed-time">
                        {timeElapsedText(entry, index)}
                    </span>
                </div>
            </React.Fragment>
        );
        const totalHours = (label, value) => (
            <div class="col-sm">
                <strong>{label}: </strong>
                <span>{formatTimespan(value)}</span>
            </div>
        );
        const hashtagTotalMapping = (tag) =>
            totalHours(unHash(tag), this.state.tags[tag]);
        const list = this.state.entries.map(
            this.state.isCopyMode ? copyModeMapping : editModeMapping);
        const copyModeClass = "btn ml-1 " + (this.state.isCopyMode
             ? "btn-secondary"
             : "btn-outline-secondary");
        return (
            <div class="container">
                {list}
                <div class="mt-2">
                    <button class="btn btn-primary" type='button'
                        title="Add an entry."
                        onClick={() => this.addEntry()}
                        disabled={this.state.isCopyMode}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button> 
                    <button class="btn btn-secondary ml-1" type="button"
                        title="Take a break."
                        onClick={(e) => this.addEntry("Break", true)}
                        disabled={this.state.isCopyMode}>
                        <FontAwesomeIcon icon={faPause} />
                    </button>
                    <button class={copyModeClass} type="button"
                        title="Toggle Copy/Report Mode"
                        onClick={() => this.toggleCopyMode()}>
                        <FontAwesomeIcon icon={faFileAlt} />
                    </button>
                    <button class="btn btn-danger ml-1" type="button"
                        title="Clear all entries."
                        onClick={() => this.clearAllEntries()}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
                <div class="mb-2">
                    {header("Totals")}
                    <p>
                        Use #Hashtagged-Category-Names to categorize time entries.
                        The last entry doesn't count toward totals.
                    </p>
                    <div class="row">
                        {totalHours(
                            "Total Uptime",
                            this.state.entries
                                .filter(x => !x.isBreak)
                                .map(x => x.elapsed)
                                .reduce((a, b) => (a || 0) + (b || 0), 0))}
                        {Object.keys(this.state.tags || []).map(hashtagTotalMapping)}
                    </div>
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
            a.timestamp.getSortable() - b.timestamp.getSortable());
        this.setStateWrapper({entries});
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
        entries.push(this.createEntry({
            timestamp: new Timestamp(new Date()),
            summary: text,
            isBreak: !!isBreak
        }));
        this.setStateWrapper({entries});
    }

    createEntry(props) {
        return {
            timestamp: props.timestamp,
            summary: props.summary,
            isBreak: !!props.isBreak,

            timestampRef: React.createRef(),
            summaryRef: React.createRef()
        };
    }

    removeEntry(index) {
        let entries = this.state.entries;
        entries.splice(index, 1);
        this.setStateWrapper({entries});
    }

    toggleCopyMode() {
        let isCopyMode = !this.state.isCopyMode;
        this.setState({isCopyMode});
    }

    clearAllEntries() {
        confirmAlert({
            title: "Clear all entries",
            message: "Are you sure?",
            buttons: [
                {
                    label: "Yes, Clear",
                    onClick: () => {
                        const entries = [];
                        this.setState({entries});
                    }
                },
                {
                    label: "No, Cancel"
                }
            ]
        });
    }

    setStateWrapper(state) {
        this.calculateTimeElapsed(state);
        this.setState(state);
        this.saveEntries(this.state.entries);
    }

    calculateTimeElapsed(state) {
        for (let i = 0; i < state.entries.length; i++) {
            const entry = state.entries[i];
            entry.elapsed = i + 1 < state.entries.length
                ? timeDiff(
                    entry.timestamp,
                    state.entries[i + 1].timestamp)
                : null;
        }

        // regenerate tag entries
        state.tags = [];
        const taggedEntries = findHashtagEntries(state.entries);
        taggedEntries.forEach(entry => {
            var tags = getHashtags(entry.summary)
                // distinct tags
                .filter((value, index, self) => self.indexOf(value) === index);
            tags.forEach(tag => {
                state.tags[tag] = (state.tags[tag] || 0) + entry.elapsed;
            });
        });
    }

    saveEntries(entries) {
        const savedEntries = entries.map(entry => {
            return {
                timestamp: entry.timestamp.toObject(),
                summary: entry.summary,
                isBreak: entry.isBreak
            };
        });
        localStorage.setItem("entries", JSON.stringify(savedEntries));
    }

    loadEntries() {
        let entries = JSON.parse(localStorage.getItem("entries"));
        if (entries) {
            // re-cast timestamps according to class
            for(let i = 0; i < entries.length; i++) {
                entries[i].timestamp = new Timestamp(entries[i].timestamp);
                entries[i] = this.createEntry(entries[i]);
            }
        }
        return entries || [];
    }
}
