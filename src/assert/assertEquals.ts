function assertEquals<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    const msg = message
      ? `${message}: expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`
      : `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`;
    throw new Error(msg);
  }
}

export { assertEquals };
