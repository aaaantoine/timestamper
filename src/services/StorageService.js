import Timestamp from '../dataTypes/Timestamp.js'
import TimeEntry from '../dataTypes/TimeEntry.js'

/**
 * Provides functions for saving and loading timestamp entries.
 */
export default class StorageService {
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
                entries[i] = new TimeEntry(entries[i]);
            }
        }
        return entries || [];
    }
};
