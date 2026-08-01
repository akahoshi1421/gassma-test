import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { createSheetWith } from "./sheetAccess";
import { fingerprintSpreadsheet } from "./fingerprintSpreadsheet";
import {
  GUARD_MODEL,
  GUARD_INITIAL_HEADERS,
  GUARD_INITIAL_ROWS,
} from "./dataLossModels";

// acceptDataLoss を渡さない限り(未指定でも false でも)列もシートも一切消えない回帰ガード。
// models にこのシート1枚しか載せない = 他の全シートが「schema に無いシート」になる状況で流す。
function testMigrateDropRequiresFlag(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    GUARD_MODEL.name,
    GUARD_INITIAL_HEADERS,
    GUARD_INITIAL_ROWS,
  );
  const before = fingerprintSpreadsheet(spreadsheetId);

  Gassma.migrateSheets({ spreadsheetId, models: [GUARD_MODEL] });
  Gassma.migrateSheets({
    spreadsheetId,
    models: [GUARD_MODEL],
    acceptDataLoss: false,
  });

  // シート数・ヘッダー・データ・グリッド幅のすべてが不変(削除も追記も起きない)
  assertDeepEquals(
    fingerprintSpreadsheet(spreadsheetId),
    before,
    "migrate drop guard: nothing is deleted without acceptDataLoss: true",
  );

  Logger.log("✅ testMigrateDropRequiresFlag: all passed");
}

export { testMigrateDropRequiresFlag };
