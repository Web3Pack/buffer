import { Buffer as B } from '../src';

test('instanceof Buffer', () => {
    const buf = new B([1, 2]);

    expect(buf instanceof B).toBeTruthy();
});

test('convert to Uint8Array in modern browsers', () => {
    const buf = new B([1, 2]);
    const uint8array = new Uint8Array(buf.buffer);

    expect(uint8array instanceof Uint8Array).toBeTruthy();
    expect(uint8array[0]).toBe(1);
    expect(uint8array[1]).toBe(2);
});

test('indexes from a string', () => {
    const buf = new B('abc');

    expect(buf[0]).toBe(97);
    expect(buf[1]).toBe(98);
    expect(buf[2]).toBe(99);
});

test('indexes from an array', () => {
    const buf = new B([97, 98, 99]);

    expect(buf[0]).toBe(97);
    expect(buf[1]).toBe(98);
    expect(buf[2]).toBe(99);
});

test('setting index value should modify buffer contents', () => {
    const buf = new B([97, 98, 99]);

    expect(buf[2]).toBe(99);
    expect(buf.toString()).toBe('abc');

    buf[2] += 10;
    expect(buf[2]).toBe(109);
    expect(buf.toString()).toBe('abm');
});

test('storing negative number should cast to unsigned', () => {
    let buf = new B(1);

    buf[0] = -3;
    expect(buf[0]).toBe(253);

    buf = new B(1);
    buf.writeInt8(-3, 0);
    expect(buf[0]).toBe(253);
});

test('test that memory is copied from array-like', () => {
    const u = new Uint8Array(4);
    const b = new B(u);
    b[0] = 1;
    b[1] = 2;
    b[2] = 3;
    b[3] = 4;

    expect(u[0]).toBe(0);
    expect(u[1]).toBe(0);
    expect(u[2]).toBe(0);
    expect(u[3]).toBe(0);
});
