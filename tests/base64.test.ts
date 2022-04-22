import { Buffer as B } from '../src';

test('base64: ignore whitespace', () => {
    const text = '\n   YW9ldQ==  ';
    const buf = new B(text, 'base64');

    expect(buf.toString()).toEqual('aoeu');
});

test('base64: strings without padding', () => {
    expect(new B('YW9ldQ', 'base64').toString()).toEqual('aoeu');
});

test('base64: newline in utf8 -- should not be an issue', () => {
    expect(
        new B(
            'LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK',
            'base64'
        ).toString('utf8')
    ).toEqual('---\ntitle: Three dashes marks the spot\ntags:\n');
});

test('base64: newline in base64 -- should get stripped', () => {
    expect(
        new B(
            'LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\nICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt',
            'base64'
        ).toString('utf8')
    ).toEqual(
        '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
    );
});

test('base64: tab characters in base64 - should get stripped', () => {
    expect(
        new B(
            'LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\t\t\t\tICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt',
            'base64'
        ).toString('utf8')
    ).toEqual(
        '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
    );
});

test('base64: invalid non-alphanumeric characters -- should be stripped', () => {
    expect(
        new B("!#$%&'()*,.:;<=>?@[\\]^`{|}~", 'base64').toString('utf8')
    ).toEqual('');
});

test('base64: high byte', () => {
    const highByte = B.from([128]);

    expect(B.alloc(1, highByte.toString('base64'), 'base64')).toEqual(highByte);
});
