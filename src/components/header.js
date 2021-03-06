import React from 'react';
import { dateFormatString } from '../utils/formatting.js'

export const header = (text, className) => (
    <div class={"border-bottom mt-4 mb-2 " + className}>
        <small>{text}</small>
    </div>
);

export const dateHeader = (entries, index, className) =>
    index === 0 || !entries[index - 1].timestamp.sortdate.isSame(entries[index].timestamp.sortdate)
        ? header(
            entries[index].timestamp.sortdate.format(dateFormatString),
            className)
        : "";
