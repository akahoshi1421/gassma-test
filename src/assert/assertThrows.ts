function assertThrows(fn: () => void, expectedMessage: string, label: string): void {
  try {
    fn();
    throw new Error(`${label}: expected to throw but did not`);
  } catch (e) {
    if (e instanceof Error && e.message.indexOf(expectedMessage) !== -1) {
      return;
    }
    throw new Error(
      `${label}: expected message containing "${expectedMessage}", but got "${e instanceof Error ? e.message : String(e)}"`,
    );
  }
}

export { assertThrows };
