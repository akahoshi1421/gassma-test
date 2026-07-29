import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, getHeaderRow, createSheetWith } from "./sheetAccess";
import {
  APPEND_MODEL,
  APPEND_INITIAL_HEADERS,
  APPEND_INITIAL_ROWS,
  APPEND_EXPECTED_HEADERS,
} from "./migrateModels";

function testMigrateAppendColumns(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    APPEND_MODEL.name,
    APPEND_INITIAL_HEADERS,
    APPEND_INITIAL_ROWS,
  );

  Gassma.migrateSheets({ spreadsheetId, models: [APPEND_MODEL] });

  const sheet = getSheet(spreadsheetId, APPEND_MODEL.name);

  // schema は [id, name, email] だが既存は [email, id]。並べ替えず "name" だけが末尾に付く
  assertDeepEquals(
    getHeaderRow(sheet, APPEND_EXPECTED_HEADERS.length),
    APPEND_EXPECTED_HEADERS,
    "migrate append: existing order kept and only the missing column appended",
  );
  assertEquals(
    sheet.getLastColumn(),
    APPEND_EXPECTED_HEADERS.length,
    "migrate append: last column",
  );

  assertDeepEquals(
    sheet.getRange(2, 1, APPEND_INITIAL_ROWS.length, 2).getValues(),
    APPEND_INITIAL_ROWS,
    "migrate append: existing data rows untouched",
  );
  assertEquals(
    sheet.getLastRow(),
    APPEND_INITIAL_ROWS.length + 1,
    "migrate append: no row added",
  );

  // ヘッダー行以外には一切書き込まない
  const appendedColumnBody = sheet
    .getRange(2, APPEND_EXPECTED_HEADERS.length, APPEND_INITIAL_ROWS.length, 1)
    .getValues()
    .map((row) => String(row[0]));
  assertDeepEquals(
    appendedColumnBody,
    ["", ""],
    "migrate append: appended column has no data written",
  );

  Logger.log("✅ testMigrateAppendColumns: all passed");
}

export { testMigrateAppendColumns };
