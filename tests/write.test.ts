import { Buffer as B } from '../src';

type fnX = 'UInt' | 'Int';
type fnY = 8 | 16 | 32;
type fnZ = 'LE' | 'BE';
type WriteXYZ = `write${fnX}${fnY}${fnZ}`;
type ReadXYZ = `read${fnX}${fnY}${fnZ}`;

const isnan = Number.isNaN;

const plan = (times: number, fn: () => void) => {
    for (let i = 0; i < times; i++) fn();
};

test('buffer.write string should get parsed as number', () => {
    const b = new B(64);
    b.writeUInt16LE('1003' as any, 0);

    expect(b.readUInt16LE(0)).toBe(1003);
});

test('buffer.writeUInt8 a fractional number will get Math.floored', () => {
    // Some extra work is necessary to make this test pass with the Object implementation
    const b = new B(1);
    b.writeInt8(5.5, 0);

    expect(b[0]).toBe(5);
});

test('writeUint8 with a negative number throws', () => {
    const buf = new B(1);

    expect(() => {
        buf.writeUInt8(-3, 0);
    }).toThrow();
});

test('hex of write{Uint,Int}{8,16,32}{LE,BE}', () => {
    plan(2 * (2 * 2 * 2 + 2), () => {
        const hex = [
            '03',
            '0300',
            '0003',
            '03000000',
            '00000003',
            'fd',
            'fdff',
            'fffd',
            'fdffffff',
            'fffffffd',
        ];

        const reads = [3, 3, 3, 3, 3, -3, -3, -3, -3, -3];
        const xs = ['UInt', 'Int'];
        const ys = [8, 16, 32];

        for (let i = 0; i < xs.length; i++) {
            const x = xs[i] as fnX;

            for (let j = 0; j < ys.length; j++) {
                const y = ys[j] as fnY;
                const endianesses = y === 8 ? [''] : ['LE', 'BE'];

                for (let k = 0; k < endianesses.length; k++) {
                    const z = endianesses[k] as fnZ;
                    const v1 = new B(y / 8);

                    const writefn: WriteXYZ = `write${x}${y}${z}`;
                    const val = x === 'Int' ? -3 : 3;

                    // @ts-ignore
                    v1[writefn](val, 0);
                    expect(v1.toString('hex')).toBe(hex.shift());

                    const readfn: ReadXYZ = `read${x}${y}${z}`;
                    // @ts-ignore
                    expect(v1[readfn](0)).toBe(reads.shift());
                }
            }
        }
    });
});

test('hex of write{Uint,Int}{8,16,32}{LE,BE} with overflow', () => {
    plan(3 * (2 * 2 * 2 + 2), () => {
        const hex = [
            '',
            '03',
            '00',
            '030000',
            '000000',
            '',
            'fd',
            'ff',
            'fdffff',
            'ffffff',
        ];

        const reads = [
            undefined,
            3,
            0,
            NaN,
            0,
            undefined,
            253,
            -256,
            16777213,
            -256,
        ];
        const xs = ['UInt', 'Int'];
        const ys = [8, 16, 32];

        for (let i = 0; i < xs.length; i++) {
            const x = xs[i];

            for (let j = 0; j < ys.length; j++) {
                const y = ys[j];
                const endianesses = y === 8 ? [''] : ['LE', 'BE'];

                for (let k = 0; k < endianesses.length; k++) {
                    const z = endianesses[k];

                    const v1 = new B(y / 8 - 1);
                    const next = new B(4);
                    next.writeUInt32BE(0, 0);
                    const writefn = 'write' + x + y + z;
                    const val = x === 'Int' ? -3 : 3;

                    // @ts-ignore
                    v1[writefn](val, 0, true);
                    expect(v1.toString('hex')).toBe(hex.shift());

                    // check that nothing leaked to next buffer.
                    expect(next.readUInt32BE(0)).toBe(0);

                    // check that no bytes are read from next buffer.
                    next.writeInt32BE(~0, 0);
                    const readfn = 'read' + x + y + z;
                    const r = reads.shift();

                    if (isnan(r)) return;
                    // @ts-ignore
                    else expect(v1[readfn](0, true)).toBe(r);
                }
            }
        }
    });
});

test('large values do not improperly roll over (ref #80)', () => {
    const nums = [-25589992, -633756690, -898146932];
    const out = new B(12);
    out.fill(0);

    out.writeInt32BE(nums[0], 0);
    let newNum = out.readInt32BE(0);

    expect(nums[0]).toBe(newNum);

    out.writeInt32BE(nums[1], 4);
    newNum = out.readInt32BE(4);

    expect(nums[1]).toBe(newNum);

    out.writeInt32BE(nums[2], 8);
    newNum = out.readInt32BE(8);

    expect(nums[2]).toBe(newNum);
});
