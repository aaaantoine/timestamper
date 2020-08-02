import React from 'react';

export const header = (text, className) => (
    <div class={"border-bottom mt-4 mb-2 " + className}>
        <small>{text}</small>
    </div>
);

export const dateHeader = (entries, index, className) =>
    index === 0 || !entries[index - 1].timestamp.date.isSame(entries[index].timestamp.date)
        ? header(
            entries[index].timestamp.date.format("YYYY-MM-DD dddd"),
            className)
        : "";
