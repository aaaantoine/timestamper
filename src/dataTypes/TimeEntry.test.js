import { TimeEntry, isTimeEntry} from './TimeEntry.js'

test('isTimeEntry: new TimeEntry returns true', () => {
    const val = new TimeEntry(new Date(), null, null);
    const actual = isTimeEntry(val);
    expect(actual).toBe(true);
});

test('isTimeEntry: object that looks like a duck returns true', () => {
    const val = {
        timestamp: new Date(),
        summary: "text",
        isBreak: false,
        timestampRef: null,
        summaryRef: null
    };
    const actual = isTimeEntry(val);
    expect(actual).toBe(true);
});

test('isTimeEntry: undefined object returns false', () => {
    const actual = isTimeEntry(undefined);
    expect(actual).toBe(false);
});

test('isTimeEntry: random object returns false', () => {
    const val = { "abc": 1, "def": "ghi", "jkl": true };
    const actual = isTimeEntry(val);
    expect(actual).toBe(false);
});

test('isTimeEntry: empty object returns false', () => {
    const val = { };
    const actual = isTimeEntry(val);
    expect(actual).toBe(false);
});