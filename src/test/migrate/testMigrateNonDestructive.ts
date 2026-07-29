import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, getSheetNames, getHeaderRow, createSheetWith } from "./sheetAccess";
import { fingerprintSheet } from "./fingerprintSpreadsheet";
import {
  KEEP_MODEL,
  KEEP_INITIAL_HEADERS,
  KEEP_INITIAL_ROWS,
  UNMANAGED_SHEET_NAME,
  UNMANAGED_HEADERS,
  UNMANAGED_ROWS,
} from "./migrateModels";

function testMigrateNonDestructive(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    KEEP_MODEL.name,
    KEEP_INITIAL_HEADERS,
    KEEP_INITIAL_ROWS,
  );
  createSheetWith(
    spreadsheetId,
    UNMANAGED_SHEET_NAME,
    UNMANAGED_HEADERS,
    UNMANAGED_ROWS,
  );

  const unmanagedBefore = fingerprintSheet(
    getSheet(spreadsheetId, UNMANAGED_SHEET_NAME),
  );

  Gassma.migrateSheets({ spreadsheetId, models: [KEEP_MODEL] });

  const keepSheet = getSheet(spreadsheetId, KEEP_MODEL.name);

  // schema に無い "legacy" 列は残る(警告のみ)
  assertDeepEquals(
    getHeaderRow(keepSheet, KEEP_INITIAL_HEADERS.length),
    KEEP_INITIAL_HEADERS,
    "migrate non-destructive: unknown column is kept",
  );
  assertEquals(
    keepSheet.getLastColumn(),
    KEEP_INITIAL_HEADERS.length,
    "migrate non-destructive: no column added when schema is satisfied",
  );

  // データ行(2行目以降)が一切書き換わらない
  assertDeepEquals(
    keepSheet
      .getRange(2, 1, KEEP_INITIAL_ROWS.length, KEEP_INITIAL_HEADERS.length)
      .getValues(),
    KEEP_INITIAL_ROWS,
    "migrate non-destructive: data rows untouched",
  );
  assertEquals(
    keepSheet.getLastRow(),
    KEEP_INITIAL_ROWS.length + 1,
    "migrate non-destructive: no row added",
  );

  // schema に無いシートも残る(警告のみ)
  assertEquals(
    getSheetNames(spreadsheetId).indexOf(UNMANAGED_SHEET_NAME) !== -1,
    true,
    "migrate non-destructive: unmanaged sheet is kept",
  );
  assertDeepEquals(
    fingerprintSheet(getSheet(spreadsheetId, UNMANAGED_SHEET_NAME)),
    unmanagedBefore,
    "migrate non-destructive: unmanaged sheet content unchanged",
  );

  Logger.log("✅ testMigrateNonDestructive: all passed");
}

export { testMigrateNonDestructive };
