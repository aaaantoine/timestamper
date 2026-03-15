import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlay, faPlus, faPause, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { header, dateHeader } from './components/header.js';
import Report from './components/Report.js';
import Totals from './components/Totals.js';

import { TimeEntry } from './dataTypes/TimeEntry.js';
import Timestamp from './dataTypes/Timestamp.js';

import { findHashtagEntries, getHashtags } from './utils/hashtagging.js';

// For JSDoc.
// eslint-disable-next-line
import StorageService from './services/StorageService.js';

/**
 * Gets the difference in time between two timestamps.
 * @param {Timestamp} timestampA 
 * @param {Timestamp} timestampB
 */
const timeDiff = (timestampA, timestampB) =>
    timestampB.getSortable() - timestampA.getSortable();

export default class Timesheet extends React.Component {
    /**
     * @param {{storageService: StorageService}} props 
     */
    constructor(props) {
        super(props);
        /**
         * Dependency for saving and loading timestamp entries.
         * @type {StorageService}
         */
        this.storageService = props.storageService;

        /**
         * The current state of the timesheet.
         * @type {{entries: TimeEntry[], isCopyMode: boolean}}
         */
        this.state = {
            /**
             * Time entries tracked throughout the use of the timesheet.
             */
            entries: this.storageService.loadEntries(),

            /**
             * Indictes whether copy mode is active.
             */
            isCopyMode: false,
        };
    }
    render() {
        /**
         * @param {TimeEntry} entry
         */
        const rowClass = entry =>
            "input-group"
            + (entry.isBreak ? " break-entry" : "");
        /**
         * 
         * @param {TimeEntry} entry 
         * @param {number} index 
         * @param {boolean} isLast
         */
        const resumeButton = (entry, index, isLast) => isLast
            ? ""
            : (
                <button class="btn btn-outline-secondary" type="button"
                        title="Add a new entry to resume this task."
                        onClick={e => this.resumeEntry(index)}>
                    <FontAwesomeIcon icon={faPlay} />
                </button>
            );
        /**
         * @param {TimeEntry} entry
         * @param {number} index
         */
        const editModeMapping = (entry, index) => (
            <React.Fragment>
                {dateHeader(this.state.entries, index)}
                <div class={rowClass(entry)}>
                    <input type="number" class="form-control timestamp"
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
                        <div class="dropdown-menu" aria-labelledby={`entryMenu${index}`}>
                            <div class="form-group">
                                <label>Entry Date</label>
                                <input type="date" class="form-control"
                                    value={entry.timestamp.renderDate()}
                                    onChange={(event) => this.updateDate(index, event.target.value)}
                                    onFocus={() => this.startTimeEntry(index)}
                                    onBlur={() => this.completeTimeEntry(index)} />
                            </div>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item text-secondary"
                                onClick={e => this.updateIsBreak(index)}>
                                <FontAwesomeIcon icon={faPause} />
                                <span class="ml-1">Toggle downtime</span>
                            </button>
                            <button class="dropdown-item text-danger"
                                onClick={(e) => this.removeEntry(index)}>
                                <FontAwesomeIcon icon={faTrashAlt} />
                                <span class="ml-1">Remove entry</span>
                            </button>
                        </div>
                        <button class="btn btn-outline-secondary" type="button"
                            id={`entryMenu${index}`}
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            title="More options">
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
        const editModeView = () => (
            <React.Fragment>
                {this.state.entries.map(editModeMapping)}
                <div className="mt-2">
                    <button className="btn btn-primary" type='button'
                        title="Add an entry."
                        onClick={() => this.addEntry()}
                        disabled={this.state.isCopyMode}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button> 
                    <button className="btn btn-secondary ml-1" type="button"
                        title="Take a break."
                        onClick={(e) => this.addEntry("Break", true)}
                        disabled={this.state.isCopyMode}>
                        <FontAwesomeIcon icon={faPause} />
                    </button>
                    <button className="btn btn-danger ml-1" type="button"
                        title="Clear all entries."
                        onClick={() => this.clearAllEntries()}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
            </React.Fragment>
        );
        const copyModeView = () => (<Report entries={this.state.entries} />);
        const list = this.state.isCopyMode ? copyModeView() : editModeView();
        return (
            <div className="container">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button type="button"
                            className={`nav-link ${!this.state.isCopyMode ? "active" : ""}`}
                            onClick={() => this.updateCopyMode(false)}>Entry</button>
                    </li>
                    <li className="nav-item">
                        <button type="button"
                            className={`nav-link ${this.state.isCopyMode ? "active" : ""}`}
                            onClick={() => this.updateCopyMode(true)}>Report</button>
                    </li>
                </ul>
                {list}
                {header("Totals", this.state.isCopyMode ? "row" : "")}
                <Totals
                    entries={this.state.entries}
                    tags={this.state.tags}
                    displayHelp={!this.state.isCopyMode} />
            </div>
        );
    }
    
    /**
     * Changes field focus based on the keycode in the event.
     * @param {number} index The current time entry index.
     * @param {KeyboardEvent} event The keyboard event to evaluate.
     * @param {string} field The name of the field referenced.
     */
    arrowKeyFocus(index, event, field) {
        let newIndex = index;
        if (event.keyCode === 38) { // up
            event.preventDefault();
            if (index <= 0) return;
            newIndex -= 1;
        }
        else if (event.keyCode === 40 || event.keyCode === 13) { // down or enter
            event.preventDefault();
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

    /**
     * Updates the given time entry's timestamp to indicate that data entry has
     * started.
     * @param {number} index - The index of the time entry to update. 
     */
    startTimeEntry = (index) =>
        this.updateTimeProp(index, x => x.startEntry());
    
    /**
     * Updates the given time entry's timestamp to indicate that data entry has
     * stopped.
     * @param {number} index - The index of the time entry to update. 
     */
    completeTimeEntry = (index) =>
        this.updateTimeProp(index, x => x.completeEntry());
    
    /**
     * Updates the given time entry's timestamp with the given date.
     * @param {number} index - The index of the time entry to update. 
     * @param {moment.MomentInput} value - The date value to apply to the timestamp.
     */
    updateDate = (index, value) =>
        this.updateTimeProp(index, x => x.setDate(value));

    /**
     * Updates the given time entry's timestamp with the given time.
     * @param {number} index - The index of the time entry to update. 
     * @param {number} value - The time value to apply to the timestamp.
     */
    updateTime = (index, value) =>
        this.updateTimeProp(index, x => x.setTime(value));
    
    /**
     * Sets the given time entry's timestamp according to the given function.
     * @param {number} index - The index of the time entry to update.
     * @param {function(Timestamp): Timestamp} func - The function process the
     * current timestamp with.
     */
    updateTimeProp = (index, func) =>
        this.updateEntry(
            index,
            "timestamp",
             x => func(x.timestamp));

    /**
     * Sets the given time entry's summary to the given value.
     * @param {number} index - The index of the time entry to update.
     * @param {string} value - The value to set.
     */
    updateSummary = (index, value) =>
        this.updateEntry(index, "summary", value);
    
    /**
     * Toggles the given time entry's `isBreak` flag.
     * @param {number} index - The index of the time entry to update.
     */
    updateIsBreak = (index) =>
        this.updateEntry(index, "isBreak", x => !x.isBreak);

    /**
     * Update a field on a time entry.
     * @param {number} index - The index of the time entry to update.
     * @param {string} field - The name of the time entry field to update.
     * @param {((function(TimeEntry): *)|string)} valueFunc - Either a literal
     * value to set, or a function to retrieve a value from the given time entry.
     */
    updateEntry(index, field, valueFunc) {
        if (typeof(valueFunc) !== "function") {
            const value = valueFunc;
            valueFunc = x => value;
        }

        /**
         * @type {TimeEntry[]}
         */
        let entries = this.state.entries;
        entries[index][field] = valueFunc(entries[index]);
        entries.sort((a, b) =>
            a.timestamp.getSortable() - b.timestamp.getSortable());
        this.setStateWrapper({entries});
    }

    /**
     * Creates a new time entry from the entry at the given index, meant to
     * indicate that the new time entry resumes the task of the given entry.
     * @param {number} index 
     */
    resumeEntry(index) {
        const resumeText = "Resume ";
        var sourceEntry = this.state.entries[index];
        var text = sourceEntry.summary;
        text = !text.startsWith(resumeText) ? resumeText + text : text;
        this.addEntry(text, sourceEntry.isBreak);
    }

    /**
     * Adds a new time entry to the timesheet with the given details,
     * timestamped to the current minute.
     * @param {string} text - The summary to apply to the time entry.
     * @param {boolean} isBreak - A value indicating whether this entry is part
     * of a break.
     */
    addEntry(text, isBreak) {
        if (!text) {
            text = '';
        }
        let entries = this.state.entries;
        entries.push(new TimeEntry({
            timestamp: new Timestamp(new Date()),
            summary: text,
            isBreak: !!isBreak
        }));
        this.setStateWrapper({entries});
    }

    /**
     * Removes the time entry at the given index.
     * @param {number} index 
     */
    removeEntry(index) {
        let entries = this.state.entries;
        entries.splice(index, 1);
        this.setStateWrapper({entries});
    }

    toggleCopyMode = () => this.updateCopyMode(!this.state.isCopyMode);

    /**
     * Sets copy mode on the timesheet.
     * @param {boolean} value 
     */
    updateCopyMode(value) {
        let isCopyMode = value;
        this.setState({isCopyMode});
    }

    /**
     * Opens a dialog confirming whether the user wants to clear all entries
     * from the timesheet.
     * If the user confirms, the entries state will be set to an empty array.
     */
    clearAllEntries() {
        confirmAlert({
            title: "Clear all entries",
            message: "Are you sure?",
            buttons: [
                {
                    label: "Yes, Clear",
                    onClick: () => {
                        const entries = [];
                        this.setStateWrapper({entries});
                    }
                },
                {
                    label: "No, Cancel"
                }
            ]
        });
    }

    /**
     * Updates React component state
     * and performs other changes related to time entry updates.
     * @param {*} state The state to pass along to
     *                  `Component.setState()`.
     */
    setStateWrapper(state) {
        this.calculateTimeElapsed(state);
        this.setState(state);
        this.storageService.saveEntries(state.entries || this.state.entries);
    }

    /**
     * Sets elapsed times on each time entry based on whether another time entry
     * follows. Updates tags and their totals as well.
     * @param {{ entries: TimeEntry[]}} state The component state, containing time entries and tags.
     */
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
}
