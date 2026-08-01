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
  DROP_COLUMN_MODEL,
  DROP_COLUMN_INITIAL_HEADERS,
  DROP_COLUMN_INITIAL_ROWS,
  DROP_COLUMN_EXPECTED_ROWS,
} from "./dataLossModels";

// schema に無い真ん中の列が実際に消え、右隣の列のデータが物理的に左へ詰まること。
// 列削除は実機ではデータの移動を伴うため、ヘッダーだけでなくデータ行まで見る。
function testMigrateDropColumn(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    DROP_COLUMN_MODEL.name,
    DROP_COLUMN_INITIAL_HEADERS,
    DROP_COLUMN_INITIAL_ROWS,
  );
  const namesBefore = getSheetNames(spreadsheetId);

  migrateWithDataLoss(spreadsheetId, [DROP_COLUMN_MODEL], []);

  const sheet = getSheet(spreadsheetId, DROP_COLUMN_MODEL.name);

  // 既存 [id, memo, name] → memo が消えて email が末尾に付き [id, name, email]
  assertDeepEquals(
    getHeaderRow(sheet, DROP_COLUMN_MODEL.columns.length),
    DROP_COLUMN_MODEL.columns,
    "migrate drop column: memo dropped and email appended",
  );
  assertEquals(
    sheet.getLastColumn(),
    DROP_COLUMN_MODEL.columns.length,
    "migrate drop column: last column",
  );

  assertDeepEquals(
    sheet
      .getRange(
        2,
        1,
        DROP_COLUMN_EXPECTED_ROWS.length,
        DROP_COLUMN_MODEL.columns.length,
      )
      .getValues(),
    DROP_COLUMN_EXPECTED_ROWS,
    "migrate drop column: name data shifted left into the dropped slot",
  );
  assertEquals(
    sheet.getLastRow(),
    DROP_COLUMN_EXPECTED_ROWS.length + 1,
    "migrate drop column: no row added or removed",
  );

  assertDeepEquals(
    getSheetNames(spreadsheetId),
    namesBefore,
    "migrate drop column: no sheet dropped",
  );

  Logger.log("✅ testMigrateDropColumn: all passed");
}

export { testMigrateDropColumn };
