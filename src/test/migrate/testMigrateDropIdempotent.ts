import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { fingerprintSpreadsheet } from "./fingerprintSpreadsheet";
import { migrateWithDataLoss } from "./dataLossHelpers";
import { MULTI_MODEL, DROP_SHEET_NAME } from "./dataLossModels";

// 削除まで済んだ状態で同じ acceptDataLoss 移行をもう一度流しても no-op。
// 列削除済みの MULTI_MODEL と削除済みシートを含む同型の呼び出しを再実行する。
function testMigrateDropIdempotent(spreadsheetId: string) {
  const before = fingerprintSpreadsheet(spreadsheetId);

  migrateWithDataLoss(spreadsheetId, [MULTI_MODEL], [DROP_SHEET_NAME]);

  assertDeepEquals(
    fingerprintSpreadsheet(spreadsheetId),
    before,
    "migrate drop idempotent: second destructive run changes nothing",
  );

  Logger.log("✅ testMigrateDropIdempotent: all passed");
}

export { testMigrateDropIdempotent };
