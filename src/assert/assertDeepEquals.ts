function assertDeepEquals(actual: unknown, expected: unknown, message?: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    const msg = message
      ? `${message}: expected ${expectedStr}, but got ${actualStr}`
      : `Expected ${expectedStr}, but got ${actualStr}`;
    throw new Error(msg);
  }
}

export { assertDeepEquals };
