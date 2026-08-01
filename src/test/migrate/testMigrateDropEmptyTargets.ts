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
  EMPTY_COLUMN_MODEL,
  EMPTY_COLUMN_INITIAL_HEADERS,
  EMPTY_COLUMN_INITIAL_ROWS,
  EMPTY_SHEET_NAME,
  EMPTY_SHEET_HEADERS,
} from "./dataLossModels";

// データの無い列とデータ行の無いシートは(警告なしの分岐で)そのまま消える。
// 警告の有無はライブラリ realm の console 側なので観測せず、削除結果だけを見る。
// 実機の空セルが "" を返すこと(= 非空 0 件の経路)を暗黙の前提として通す。
function testMigrateDropEmptyTargets(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    EMPTY_COLUMN_MODEL.name,
    EMPTY_COLUMN_INITIAL_HEADERS,
    EMPTY_COLUMN_INITIAL_ROWS,
  );
  createSheetWith(spreadsheetId, EMPTY_SHEET_NAME, EMPTY_SHEET_HEADERS, []);

  migrateWithDataLoss(
    spreadsheetId,
    [EMPTY_COLUMN_MODEL],
    [EMPTY_SHEET_NAME],
  );

  const sheet = getSheet(spreadsheetId, EMPTY_COLUMN_MODEL.name);
  assertDeepEquals(
    getHeaderRow(sheet, EMPTY_COLUMN_MODEL.columns.length),
    EMPTY_COLUMN_MODEL.columns,
    "migrate drop empty: header-only blank column dropped",
  );
  assertEquals(
    sheet.getLastColumn(),
    EMPTY_COLUMN_MODEL.columns.length,
    "migrate drop empty: last column",
  );
  assertDeepEquals(
    sheet
      .getRange(2, 1, EMPTY_COLUMN_INITIAL_ROWS.length, 1)
      .getValues(),
    EMPTY_COLUMN_INITIAL_ROWS,
    "migrate drop empty: id column untouched",
  );

  assertEquals(
    getSheetNames(spreadsheetId).indexOf(EMPTY_SHEET_NAME),
    -1,
    "migrate drop empty: header-only sheet dropped",
  );

  Logger.log("✅ testMigrateDropEmptyTargets: all passed");
}

export { testMigrateDropEmptyTargets };
