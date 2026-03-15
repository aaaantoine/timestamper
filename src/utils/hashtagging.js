// For JSDoc.
// eslint-disable-next-line
import { TimeEntry } from '../dataTypes/TimeEntry.js';

/**
 * The regular expression defining what a hashtag can look like in a string.
 */
export const hashtagRegex = /#[\w-]+/g;

/**
 * From a given set of time entries, return only entries where the summary
 * contains a hashtag.
 * @param {TimeEntry[]} entries
 */
export const findHashtagEntries = entries => 
    entries.filter(x => x.summary.search(hashtagRegex) >= 0);

/**
 * Get regular expression matches for hashtags on the given text.
 * @param {string} text
 */
export const getHashtags = text => text.match(hashtagRegex);

/**
 * Replace special hashtag characters in the given text.
 * The hash mark `#` is removed, and all hyphens `-` are replaced with spaces ` `.
 * @param {string} text - The text to modify.
 */
export const unHash = text => text.replace(/#/, "").replace(/-/g, " ");
