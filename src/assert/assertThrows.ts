function assertThrows(fn: () => void, expectedMessage: string, label: string): void {
  try {
    fn();
    throw new Error(`${label}: expected to throw but did not`);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.indexOf(expectedMessage) !== -1) {
      return;
    }
    throw new Error(
      `${label}: expected message containing "${expectedMessage}", but got "${message}"`,
    );
  }
}

export { assertThrows };
