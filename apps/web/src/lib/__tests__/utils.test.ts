import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatCurrency, truncateText, generateId, debounce } from '../utils';

describe('cn (className utility)', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
    expect(cn('foo', ['bar', 'baz'])).toBe('foo bar baz');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('formatDate', () => {
  it('formats dates correctly', () => {
    const date = new Date('2024-03-15');
    expect(formatDate(date)).toMatch(/March 15, 2024/);
  });

  it('handles string dates', () => {
    expect(formatDate('2024-03-15')).toMatch(/March 15, 2024/);
  });

  it('handles timestamp dates', () => {
    const timestamp = new Date('2024-03-15').getTime();
    expect(formatDate(timestamp)).toMatch(/March 15, 2024/);
  });
});

describe('formatCurrency', () => {
  it('formats XAF correctly', () => {
    expect(formatCurrency(1000, 'XAF')).toBe('1,000 FCFA');
    expect(formatCurrency(50000, 'XAF')).toBe('50,000 FCFA');
  });

  it('formats USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
    expect(formatCurrency(50.5, 'USD')).toBe('$50.50');
  });

  it('formats EUR correctly', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
  });

  it('handles zero and negative amounts', () => {
    expect(formatCurrency(0, 'XAF')).toBe('0 FCFA');
    expect(formatCurrency(-100, 'USD')).toBe('-$100.00');
  });
});

describe('truncateText', () => {
  it('truncates long text', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
    expect(truncateText('Hello World', 8)).toBe('Hello Wo...');
  });

  it('does not truncate short text', () => {
    expect(truncateText('Hi', 10)).toBe('Hi');
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('generates IDs with correct length', () => {
    const id = generateId(8);
    expect(id.length).toBe(8);
  });

  it('generates IDs with only valid characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

describe('debounce', () => {
  it('delays function execution', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('resets timer on multiple calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    vi.advanceTimersByTime(50);
    debouncedFn();
    vi.advanceTimersByTime(50);
    debouncedFn();
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('passes arguments to debounced function', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');

    vi.useRealTimers();
  });
});
