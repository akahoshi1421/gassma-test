function captureError(fn: () => void, label: string): unknown {
  try {
    fn();
  } catch (e) {
    return e;
  }
  throw new Error(`${label}: expected to throw but did not`);
}

export { captureError };
