import { Buffer as B } from '../src';

test('modifying buffer created by .slice() modifies original memory', () => {
    const buf1 = new B(26);
    for (let i = 0; i < 26; i++) {
        buf1[i] = i + 97; // 97 is ASCII a
    }

    const buf2 = buf1.slice(0, 3);
    expect(buf2.toString('ascii', 0, buf2.length)).toBe('abc');

    buf2[0] = '!'.charCodeAt(0);
    expect(buf1.toString('ascii', 0, buf2.length)).toBe('!bc');
});

test("modifying parent buffer modifies .slice() buffer's memory", () => {
    const buf1 = new B(26);
    for (let i = 0; i < 26; i++) {
        buf1[i] = i + 97; // 97 is ASCII a
    }

    const buf2 = buf1.slice(0, 3);
    expect(buf2.toString('ascii', 0, buf2.length)).toBe('abc');

    buf1[0] = '!'.charCodeAt(0);
    expect(buf2.toString('ascii', 0, buf2.length)).toBe('!bc');
});
