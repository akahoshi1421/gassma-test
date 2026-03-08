type Where = Record<string, unknown>;
type Expected = Record<string, unknown>;

class SheetSnapshot {
  private sheetName: string;
  private headers: string[];
  private rows: unknown[][];

  constructor(sheetName: string, headers: string[], rows: unknown[][]) {
    this.sheetName = sheetName;
    this.headers = headers;
    this.rows = rows;
  }

  private toRecord(row: unknown[]): Record<string, unknown> {
    const record: Record<string, unknown> = {};
    this.headers.forEach((header, i) => {
      record[header] = row[i];
    });
    return record;
  }

  private matchesWhere(row: unknown[], where: Where): boolean {
    return Object.entries(where).every(([key, value]) => {
      const index = this.headers.indexOf(key);
      if (index === -1) throw new Error(`[${this.sheetName}] Column "${key}" not found`);
      return row[index] === value;
    });
  }

  private findRows(where: Where): unknown[][] {
    return this.rows.filter((row) => this.matchesWhere(row, where));
  }

  assertRowExists(where: Where): void {
    const matched = this.findRows(where);
    if (matched.length === 0) {
      throw new Error(
        `[${this.sheetName}] Expected row matching ${JSON.stringify(where)} to exist, but not found`,
      );
    }
  }

  assertRowNotExists(where: Where): void {
    const matched = this.findRows(where);
    if (matched.length > 0) {
      throw new Error(
        `[${this.sheetName}] Expected row matching ${JSON.stringify(where)} to not exist, but found ${matched.length} row(s)`,
      );
    }
  }

  assertRowEquals(where: Where, expected: Expected): void {
    const matched = this.findRows(where);
    if (matched.length === 0) {
      throw new Error(
        `[${this.sheetName}] Row matching ${JSON.stringify(where)} not found`,
      );
    }
    if (matched.length > 1) {
      throw new Error(
        `[${this.sheetName}] Expected 1 row matching ${JSON.stringify(where)}, but found ${matched.length}`,
      );
    }

    const record = this.toRecord(matched[0]);
    Object.entries(expected).forEach(([key, expectedValue]) => {
      const actual = record[key];
      if (actual !== expectedValue) {
        throw new Error(
          `[${this.sheetName}] Row ${JSON.stringify(where)}: expected "${key}" to be ${JSON.stringify(expectedValue)}, but got ${JSON.stringify(actual)}`,
        );
      }
    });
  }

  assertCount(expected: number): void {
    if (this.rows.length !== expected) {
      throw new Error(
        `[${this.sheetName}] Expected ${expected} rows, but got ${this.rows.length}`,
      );
    }
  }
}

export { SheetSnapshot };
