import { Buffer as B } from '../src';
import isBuffer from 'is-buffer';

test('is-buffer tests', () => {
    // rewrite above matchers to jest
    expect(isBuffer(new B(4))).toBeTruthy();
    expect(isBuffer(undefined)).toBeFalsy();
    expect(isBuffer(null)).toBeFalsy();
    expect(isBuffer('')).toBeFalsy();
    expect(isBuffer(true)).toBeFalsy();
    expect(isBuffer(false)).toBeFalsy();
    expect(isBuffer(0)).toBeFalsy();
    expect(isBuffer(1)).toBeFalsy();
    expect(isBuffer(1.0)).toBeFalsy();
    expect(isBuffer('string')).toBeFalsy();
    expect(isBuffer({})).toBeFalsy();
    expect(isBuffer(function foo() {})).toBeFalsy();
});
