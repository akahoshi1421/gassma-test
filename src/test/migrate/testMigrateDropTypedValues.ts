import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, getHeaderRow, createSheetWith } from "./sheetAccess";
import { migrateWithDataLoss } from "./dataLossHelpers";
import {
  TYPED_MODEL,
  TYPED_INITIAL_HEADERS,
  TYPED_INITIAL_ROWS,
} from "./dataLossModels";

// 0 / false / Date だけの列を削除対象にする。非空判定は !== "" なので
// これらは「データ入り」として数えられる(警告付きで削除)。警告そのものは
// ライブラリ realm の console に出て観測できないため、前提(実機のセルが
// 型付きの値を返すこと)と結果(列が消え id 列が無傷なこと)を検証する。
function testMigrateDropTypedValues(spreadsheetId: string) {
  const created = createSheetWith(
    spreadsheetId,
    TYPED_MODEL.name,
    TYPED_INITIAL_HEADERS,
    TYPED_INITIAL_ROWS,
  );

  // 前提: モックと違い実機の getValues は number / boolean / Date を返す
  const flagsColumn = created
    .getRange(2, 2, TYPED_INITIAL_ROWS.length, 1)
    .getValues();
  assertEquals(
    typeof flagsColumn[0][0],
    "number",
    "migrate drop typed: 0 comes back as a number cell",
  );
  assertEquals(flagsColumn[0][0], 0, "migrate drop typed: 0 keeps its value");
  assertEquals(
    typeof flagsColumn[1][0],
    "boolean",
    "migrate drop typed: false comes back as a boolean cell",
  );
  assertEquals(
    flagsColumn[1][0],
    false,
    "migrate drop typed: false keeps its value",
  );
  assertEquals(
    Object.prototype.toString.call(flagsColumn[2][0]),
    "[object Date]",
    "migrate drop typed: Date comes back as a date cell",
  );

  migrateWithDataLoss(spreadsheetId, [TYPED_MODEL], []);

  const sheet = getSheet(spreadsheetId, TYPED_MODEL.name);
  assertDeepEquals(
    getHeaderRow(sheet, TYPED_MODEL.columns.length),
    TYPED_MODEL.columns,
    "migrate drop typed: flags column dropped",
  );
  assertEquals(
    sheet.getLastColumn(),
    TYPED_MODEL.columns.length,
    "migrate drop typed: last column",
  );
  assertDeepEquals(
    sheet.getRange(2, 1, TYPED_INITIAL_ROWS.length, 1).getValues(),
    TYPED_INITIAL_ROWS.map((row) => [row[0]]),
    "migrate drop typed: id column untouched",
  );
  assertEquals(
    sheet.getLastRow(),
    TYPED_INITIAL_ROWS.length + 1,
    "migrate drop typed: no row added or removed",
  );

  Logger.log("✅ testMigrateDropTypedValues: all passed");
}

export { testMigrateDropTypedValues };
