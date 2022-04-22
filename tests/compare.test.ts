import { Buffer as B } from '../src';

test('buffer.compare', () => {
    const b = new B(1).fill('a');
    const c = new B(1).fill('c');
    const d = new B(2).fill('aa');

    expect(b.compare(c)).toBe(-1);
    expect(c.compare(d)).toBe(1);
    expect(d.compare(b)).toBe(1);
    expect(b.compare(d)).toBe(-1);

    // static method
    expect(B.compare(b, c)).toBe(-1);
    expect(B.compare(c, d)).toBe(1);
    expect(B.compare(d, b)).toBe(1);
    expect(B.compare(b, d)).toBe(-1);
});

test('buffer.compare argument validation', () => {
    const invalidArg = 'abc' as any;

    expect(() => {
        const b = new B(1);
        B.compare(b, invalidArg);
    }).toThrow();

    expect(() => {
        const b = new B(1);
        B.compare(invalidArg, b);
    }).toThrow();

    expect(() => {
        const b = new B(1);
        b.compare(invalidArg);
    }).toThrow();
});

test('buffer.equals', () => {
    const b = new B(5).fill('abcdf');
    const c = new B(5).fill('abcdf');
    const d = new B(5).fill('abcde');
    const e = new B(6).fill('abcdef');

    expect(b.equals(c)).toBeTruthy();
    expect(c.equals(d)).toBeFalsy();
    expect(d.equals(e)).toBeFalsy();
});

test('buffer.equals argument validation', () => {
    const invalidArg = 'abc' as any;

    expect(() => {
        const b = new B(1);
        b.equals(invalidArg);
    }).toThrow();
});
