import { emptinessScorer } from '../scorers';

describe('emptinessScorer', () => {
  test('returns 1.0 for exact length matches', () => {
    expect(emptinessScorer('hello', 'world')).toBe(1.0);
    expect(emptinessScorer('', '')).toBe(1.0);
    expect(emptinessScorer('abc', 'def')).toBe(1.0);
  });

  test('returns 0.0 when one string is empty', () => {
    expect(emptinessScorer('', 'hello')).toBe(0.0);
    expect(emptinessScorer('hello', '')).toBe(0.0);
    expect(emptinessScorer('hello', null)).toBe(0.0);
  });

  test('returns proportional scores for different lengths', () => {
    expect(emptinessScorer('12345', '1234567890')).toBe(0.5); // 5/10
    expect(emptinessScorer('123', '1234')).toBe(0.75); // 3/4
    expect(emptinessScorer('12345', '123')).toBe(0.6); // 3/5
  });

  test('handles whitespace correctly', () => {
    expect(emptinessScorer('  hello  ', 'world')).toBe(1.0);
    expect(emptinessScorer('  12  ', '123')).toBe(2/3); // length 2 vs 3 after trim
  });
});
