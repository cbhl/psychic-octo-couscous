export function emptinessScorer(output: string, expected: string | null) {
    expected = expected || '';
    const outputLen = output.trim().length;
    const expectedLen = expected.trim().length;
    if (outputLen === expectedLen) return 1;
    if (outputLen === 0 || expectedLen === 0) return 0;
    const minLen = Math.min(outputLen, expectedLen);
    const maxLen = Math.max(outputLen, expectedLen);
    return minLen / maxLen;
}