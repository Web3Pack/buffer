import { Buffer as B } from '../src';

test('write/read Infinity as a float', () => {
    const buf = new B(4);

    expect(buf.writeFloatBE(Infinity, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(Infinity);
});

test('write/read -Infinity as a float', () => {
    const buf = new B(4);

    expect(buf.writeFloatBE(-Infinity, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(-Infinity);
});

test('write/read Infinity as a double', () => {
    const buf = new B(8);

    expect(buf.writeDoubleBE(Infinity, 0)).toBe(8);
    expect(buf.readDoubleBE(0)).toBe(Infinity);
});

test('write/read -Infinity as a double', () => {
    const buf = new B(8);

    expect(buf.writeDoubleBE(-Infinity, 0)).toBe(8);
    expect(buf.readDoubleBE(0)).toBe(-Infinity);
});

test('write/read float greater than max', () => {
    const buf = new B(4);

    expect(buf.writeFloatBE(4e38, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(Infinity);
});

test('write/read float less than min', () => {
    const buf = new B(4);

    expect(buf.writeFloatBE(-4e40, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(-Infinity);
});
