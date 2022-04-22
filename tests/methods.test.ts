import { Buffer as B } from '../src';

test('buffer.toJSON', () => {
    const data = [1, 2, 3, 4];

    expect(new B(data).toJSON()).toEqual({
        type: 'Buffer',
        data: [1, 2, 3, 4],
    });
});

test('buffer.copy', () => {
    // copied from nodejs.org example
    const buf1 = new B(26);
    const buf2 = new B(26);

    for (let i = 0; i < 26; i++) {
        buf1[i] = i + 97; // 97 is ASCII a
        buf2[i] = 33; // ASCII !
    }

    buf1.copy(buf2, 8, 16, 20);

    expect(buf2.toString('ascii', 0, 25)).toEqual('!!!!!!!!qrst!!!!!!!!!!!!!');
});

test('test offset returns are correct', () => {
    const b = new B(16);

    expect(4).toEqual(b.writeUInt32LE(0, 0));
    expect(6).toEqual(b.writeUInt16LE(0, 4));
    expect(7).toEqual(b.writeUInt8(0, 6));
    expect(8).toEqual(b.writeInt8(0, 7));
    expect(16).toEqual(b.writeDoubleLE(0, 8));
});

test('concat() a varying number of buffers', () => {
    const zero: B[] = [];
    const one: B[] = [new B('asdf')];
    const long: B[] = [];

    for (let i = 0; i < 10; i++) {
        long.push(new B('asdf'));
    }

    const flatZero = B.concat(zero);
    const flatOne = B.concat(one);
    const flatLong = B.concat(long);
    const flatLongLen = B.concat(long, 40);

    expect(flatZero.length).toEqual(0);
    expect(flatOne.toString()).toEqual('asdf');
    expect(flatOne).toEqual(one[0]);
    expect(flatLong.toString()).toEqual(new Array(10 + 1).join('asdf'));
    expect(flatLongLen.toString()).toEqual(new Array(10 + 1).join('asdf'));
});

test('concat() works on Uint8Array instances', () => {
    const result = B.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4])]);
    const expected = B.from([1, 2, 3, 4]);

    expect(result).toEqual(expected);
});

test('concat() works on Uint8Array instances for smaller provided totalLength', () => {
    const result = B.concat(
        [new Uint8Array([1, 2]), new Uint8Array([3, 4])],
        3
    );
    const expected = B.from([1, 2, 3]);

    expect(result).toEqual(expected);
});

test('fill', () => {
    const b = new B(10);
    b.fill(2);

    expect(b.toString('hex')).toEqual('02020202020202020202');
});

test('fill (string)', () => {
    const b = new B(10);
    b.fill('abc');

    expect(b.toString()).toEqual('abcabcabca');

    b.fill('է');

    expect(b.toString()).toEqual('էէէէէ');
});

test('copy() empty buffer with sourceEnd=0', () => {
    const source = new B([42]);
    const destination = new B([43]);
    source.copy(destination, 0, 0, 0);

    expect(destination.readUInt8(0)).toEqual(43);
});

test('copy() after slice()', () => {
    const source = new B(200);
    const dest = new B(200);
    const expected = new B(200);
    for (let i = 0; i < 200; i++) {
        source[i] = i;
        dest[i] = 0;
    }

    source.slice(2).copy(dest);
    source.copy(expected, 0, 2);

    expect(dest).toEqual(expected);
});

test('copy() ascending', () => {
    const b = new B('abcdefghij');
    b.copy(b, 0, 3, 10);

    expect(b.toString()).toEqual('defghijhij');
});

test('copy() descending', () => {
    const b = new B('abcdefghij');
    b.copy(b, 3, 0, 7);

    expect(b.toString()).toEqual('abcabcdefg');
});

test('buffer.slice sets indexes', () => {
    expect(new B('hallo').slice(0, 5).toString()).toEqual('hallo');
});

test('buffer.slice out of range', () => {
    expect(new B('hallo').slice(0, 10).toString()).toEqual('hallo');
    expect(new B('hallo').slice(10, 2).toString()).toEqual('');
});
