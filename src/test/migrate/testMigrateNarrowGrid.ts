import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, getHeaderRow, createSheetWith } from "./sheetAccess";
import {
  NARROW_MODEL,
  NARROW_MAX_COLUMNS,
  NARROW_INITIAL_HEADERS,
  NARROW_INITIAL_ROWS,
} from "./migrateModels";

// deleteColumns でグリッドを詰めた既存シートに対し、
// 上限を超える列追記でもグリッドが広がることを確かめる。
function testMigrateNarrowGrid(spreadsheetId: string) {
  const created = createSheetWith(
    spreadsheetId,
    NARROW_MODEL.name,
    NARROW_INITIAL_HEADERS,
    NARROW_INITIAL_ROWS,
  );
  const surplus = created.getMaxColumns() - NARROW_MAX_COLUMNS;
  if (surplus > 0) created.deleteColumns(NARROW_MAX_COLUMNS + 1, surplus);

  assertEquals(
    created.getMaxColumns(),
    NARROW_MAX_COLUMNS,
    "migrate narrow grid: precondition max columns",
  );

  Gassma.migrateSheets({ spreadsheetId, models: [NARROW_MODEL] });

  const sheet = getSheet(spreadsheetId, NARROW_MODEL.name);

  assertEquals(
    sheet.getMaxColumns() >= NARROW_MODEL.columns.length,
    true,
    `migrate narrow grid: grid grew past the shrunken limit (actual ${sheet.getMaxColumns()})`,
  );
  assertDeepEquals(
    getHeaderRow(sheet, NARROW_MODEL.columns.length),
    NARROW_MODEL.columns,
    "migrate narrow grid: missing columns appended after expansion",
  );
  assertDeepEquals(
    sheet
      .getRange(2, 1, NARROW_INITIAL_ROWS.length, NARROW_INITIAL_HEADERS.length)
      .getValues(),
    NARROW_INITIAL_ROWS,
    "migrate narrow grid: data row untouched",
  );
  assertEquals(
    sheet.getLastRow(),
    NARROW_INITIAL_ROWS.length + 1,
    "migrate narrow grid: no row added",
  );

  Logger.log("✅ testMigrateNarrowGrid: all passed");
}

export { testMigrateNarrowGrid };
