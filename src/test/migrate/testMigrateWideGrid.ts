import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, getHeaderRow } from "./sheetAccess";
import { WIDE_MODEL, WIDE_COLUMN_COUNT } from "./migrateModels";

// 新規シートの既定グリッドは26列で、setValues は自動拡張しない。
// 26列を超えるモデルでも全ヘッダーが書けることを実機で確かめる。
function testMigrateWideGrid(spreadsheetId: string) {
  Gassma.migrateSheets({ spreadsheetId, models: [WIDE_MODEL] });

  const sheet = getSheet(spreadsheetId, WIDE_MODEL.name);

  assertEquals(
    sheet.getMaxColumns() >= WIDE_COLUMN_COUNT,
    true,
    `migrate wide grid: grid holds at least ${WIDE_COLUMN_COUNT} columns (actual ${sheet.getMaxColumns()})`,
  );
  assertDeepEquals(
    getHeaderRow(sheet, WIDE_COLUMN_COUNT),
    WIDE_MODEL.columns,
    "migrate wide grid: all headers written past the default 26 columns",
  );
  assertEquals(
    sheet.getLastColumn(),
    WIDE_COLUMN_COUNT,
    "migrate wide grid: last column",
  );
  assertEquals(
    sheet.getLastRow(),
    1,
    "migrate wide grid: only the header row is written",
  );

  Logger.log("✅ testMigrateWideGrid: all passed");
}

export { testMigrateWideGrid };
