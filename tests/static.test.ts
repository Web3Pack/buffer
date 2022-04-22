import { Buffer as B } from '../src';

test('Buffer.isEncoding', () => {
    expect(B.isEncoding('HEX')).toBe(true);
    expect(B.isEncoding('hex')).toBe(true);
    expect(B.isEncoding('bad')).toBe(false);
});

test('Buffer.isBuffer', () => {
    expect(B.isBuffer(new B('hey', 'utf8'))).toBe(true);
    expect(B.isBuffer(new B([1, 2, 3]))).toBe(true);
    expect(B.isBuffer('hey')).toBe(false);
});
