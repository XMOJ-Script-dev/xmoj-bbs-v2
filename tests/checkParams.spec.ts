import { describe, it, expect } from 'vitest';
import { CheckParams } from '../server/utils/checkParams';

describe('CheckParams', () => {
  it('passes with correct types', () => {
    const res = CheckParams({ a: 1, b: 'x' }, { a: 'number', b: 'string' });
    expect(res.Success).toBe(true);
  });

  it('fails on missing key', () => {
    const res = CheckParams({ a: 1 }, { a: 'number', b: 'string' });
    expect(res.Success).toBe(false);
    expect(res.Message).toContain('参数b');
  });

  it('fails on wrong type', () => {
    const res = CheckParams({ a: '1' } as any, { a: 'number' });
    expect(res.Success).toBe(false);
  });

  it('enforces min/max and enum', () => {
    expect(CheckParams({ a: 5 }, { a: { type: 'number', min: 10 } }).Success).toBe(false);
    expect(CheckParams({ a: 50 }, { a: { type: 'number', max: 10 } }).Success).toBe(false);
    expect(CheckParams({ a: 'x' }, { a: { type: 'string', enum: ['y', 'z'] } }).Success).toBe(false);
  });
});
