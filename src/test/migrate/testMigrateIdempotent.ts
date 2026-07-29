import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetNames } from "./sheetAccess";
import { fingerprintSpreadsheet } from "./fingerprintSpreadsheet";
import { ALL_MODELS, UNMANAGED_SHEET_NAME } from "./migrateModels";

function testMigrateIdempotent(spreadsheetId: string) {
  // 全モデルを一度流して同期済み状態にしてから、同じ定義をもう一度流す
  Gassma.migrateSheets({ spreadsheetId, models: ALL_MODELS });
  const before = fingerprintSpreadsheet(spreadsheetId);

  Gassma.migrateSheets({ spreadsheetId, models: ALL_MODELS });
  const after = fingerprintSpreadsheet(spreadsheetId);

  // シート数・シート名・ヘッダー・データ・グリッド幅のすべてが不変
  assertDeepEquals(
    after,
    before,
    "migrate idempotent: second run changes nothing",
  );

  const names = getSheetNames(spreadsheetId);
  ALL_MODELS.forEach((model) => {
    assertEquals(
      names.indexOf(model.name) !== -1,
      true,
      `migrate idempotent: sheet "${model.name}" still present`,
    );
  });
  assertEquals(
    names.indexOf(UNMANAGED_SHEET_NAME) !== -1,
    true,
    "migrate idempotent: unmanaged sheet survives a second run",
  );

  Logger.log("✅ testMigrateIdempotent: all passed");
}

export { testMigrateIdempotent };
