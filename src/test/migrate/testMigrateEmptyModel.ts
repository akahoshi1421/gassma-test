import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, createSheetWith } from "./sheetAccess";
import { fingerprintSheet } from "./fingerprintSpreadsheet";
import { migrateWithDataLoss } from "./dataLossHelpers";
import {
  EMPTY_MODEL,
  EMPTY_MODEL_INITIAL_HEADERS,
  EMPTY_MODEL_INITIAL_ROWS,
} from "./dataLossModels";

// columns: [] のモデルは列を1つも管理しない。
// acceptDataLoss: true でも既存の列とデータが1つも失われないこと
// (フラグ無しでは元から何も消えないので、フラグ有りで流さないと意味がない)。
function testMigrateEmptyModel(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    EMPTY_MODEL.name,
    EMPTY_MODEL_INITIAL_HEADERS,
    EMPTY_MODEL_INITIAL_ROWS,
  );
  const before = fingerprintSheet(getSheet(spreadsheetId, EMPTY_MODEL.name));

  migrateWithDataLoss(spreadsheetId, [EMPTY_MODEL], []);

  // ヘッダー・データ行・グリッド幅のすべてが不変
  assertDeepEquals(
    fingerprintSheet(getSheet(spreadsheetId, EMPTY_MODEL.name)),
    before,
    "migrate empty model: no column and no data is lost even with acceptDataLoss",
  );

  Logger.log("✅ testMigrateEmptyModel: all passed");
}

export { testMigrateEmptyModel };
