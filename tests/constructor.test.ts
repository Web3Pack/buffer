import { Buffer as B } from '../src';

test('new buffer from array', () => {
    expect(new B([1, 2, 3]).toString()).toBe('\u0001\u0002\u0003');
});

test('new buffer from array w/ negatives', () => {
    expect(new B([-1, -2, -3]).toString('hex')).toBe('fffefd');
});

test('new buffer from array with mixed signed input', () => {
    expect(
        new B([-255, 255, -128, 128, 512, -512, 511, -511]).toString('hex')
    ).toBe('01ff80800000ff01');
});

test('new buffer from string', () => {
    expect(new B('hey', 'utf8').toString()).toBe('hey');
});

test('new buffer from buffer', () => {
    const b1 = new B('asdf');
    const b2 = new B(b1);

    expect(b1.toString('hex')).toBe(b2.toString('hex'));
});

test('new buffer from ArrayBuffer', () => {
    if (typeof ArrayBuffer !== 'undefined') {
        const arraybuffer = new Uint8Array([0, 1, 2, 3]).buffer;
        const b = new B(arraybuffer);

        expect(b.length).toBe(4);
        expect(b[0]).toBe(0);
        expect(b[1]).toBe(1);
        expect(b[2]).toBe(2);
        expect(b[3]).toBe(3);
        expect(b[4]).toBeUndefined();
    }
});

test('new buffer from ArrayBuffer, shares memory', () => {
    const u = new Uint8Array([0, 1, 2, 3]);
    const arraybuffer = u.buffer;
    const b = new B(arraybuffer);

    expect(b.length).toBe(4);
    expect(b[0]).toBe(0);
    expect(b[1]).toBe(1);
    expect(b[2]).toBe(2);
    expect(b[3]).toBe(3);
    expect(b[4]).toBeUndefined();

    // changing the Uint8Array (and thus the ArrayBuffer), changes the Buffer
    u[0] = 10;
    expect(b[0]).toBe(10);

    u[1] = 11;
    expect(b[1]).toBe(11);

    u[2] = 12;
    expect(b[2]).toBe(12);

    u[3] = 13;
    expect(b[3]).toBe(13);
});

test('new buffer from Uint8Array', () => {
    if (typeof Uint8Array !== 'undefined') {
        const b1 = new Uint8Array([0, 1, 2, 3]);
        const b2 = new B(b1);

        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Uint16Array', () => {
    if (typeof Uint16Array !== 'undefined') {
        const b1 = new Uint16Array([0, 1, 2, 3]);
        const b2 = new B(b1);

        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Uint32Array', () => {
    if (typeof Uint32Array !== 'undefined') {
        const b1 = new Uint32Array([0, 1, 2, 3]);
        const b2 = new B(b1);

        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Int16Array', () => {
    if (typeof Int16Array !== 'undefined') {
        const b1 = new Int16Array([0, 1, 2, 3]);
        const b2 = new B(b1);

        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Int32Array', () => {
    if (typeof Int32Array !== 'undefined') {
        const b1 = new Int32Array([0, 1, 2, 3]);
        const b2 = new B(b1);

        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Float32Array', () => {
    if (typeof Float32Array !== 'undefined') {
        const b1 = new Float32Array([0, 1, 2, 3]);
        const b2 = new B(b1);

        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Float64Array', () => {
    if (typeof Float64Array !== 'undefined') {
        const b1 = new Float64Array([0, 1, 2, 3]);
        const b2 = new B(b1);

        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from buffer.toJSON() output', () => {
    if (typeof JSON === 'undefined') {
        // ie6, ie7 lack support

        return;
    }
    const buf = new B('test');
    const json = JSON.stringify(buf);
    const obj = JSON.parse(json);
    const copy = new B(obj);

    expect(buf.equals(copy)).toBeTruthy();
});
