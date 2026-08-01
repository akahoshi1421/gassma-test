import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import {
  getSheet,
  getSheetNames,
  getHeaderRow,
  createSheetWith,
} from "./sheetAccess";
import { migrateWithDataLoss } from "./dataLossHelpers";
import {
  MULTI_MODEL,
  MULTI_INITIAL_HEADERS,
  MULTI_INITIAL_ROWS,
  MULTI_EXPECTED_ROWS,
} from "./dataLossModels";

// 先頭・中間・末尾に挟んだ4本の余分な列を一度に落とす。
// 削除のたびに実機では右側の列が左へ詰まるため、意図しない列まで消えたり
// データが行内でずれたりしないこと(位置ずれ)をデータ行の値で確かめる。
function testMigrateDropMultipleColumns(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    MULTI_MODEL.name,
    MULTI_INITIAL_HEADERS,
    MULTI_INITIAL_ROWS,
  );
  const namesBefore = getSheetNames(spreadsheetId);

  migrateWithDataLoss(spreadsheetId, [MULTI_MODEL], []);

  const sheet = getSheet(spreadsheetId, MULTI_MODEL.name);

  // [legacy1, id, legacy2, name, legacy3, email, legacy4] → [id, name, email]
  assertDeepEquals(
    getHeaderRow(sheet, MULTI_MODEL.columns.length),
    MULTI_MODEL.columns,
    "migrate drop multiple: only the schema columns remain, in original order",
  );
  assertEquals(
    sheet.getLastColumn(),
    MULTI_MODEL.columns.length,
    "migrate drop multiple: last column",
  );

  assertDeepEquals(
    sheet
      .getRange(2, 1, MULTI_EXPECTED_ROWS.length, MULTI_MODEL.columns.length)
      .getValues(),
    MULTI_EXPECTED_ROWS,
    "migrate drop multiple: surviving cells keep their own rows and columns",
  );
  assertEquals(
    sheet.getLastRow(),
    MULTI_EXPECTED_ROWS.length + 1,
    "migrate drop multiple: no row added or removed",
  );

  assertDeepEquals(
    getSheetNames(spreadsheetId),
    namesBefore,
    "migrate drop multiple: no sheet dropped",
  );

  Logger.log("✅ testMigrateDropMultipleColumns: all passed");
}

export { testMigrateDropMultipleColumns };
