import { withTemporarySpreadsheet } from "./migrate/withTemporarySpreadsheet";
import { testMigrateCreateSheet } from "./migrate/testMigrateCreateSheet";
import { testMigrateAppendColumns } from "./migrate/testMigrateAppendColumns";
import { testMigrateNonDestructive } from "./migrate/testMigrateNonDestructive";
import { testMigrateIdempotent } from "./migrate/testMigrateIdempotent";

// migrate は本番フィクスチャ(DB1)へ一切書き込まないため resetAllSheets しない。
// 検証はすべて使い捨てスプレッドシート上で行い、終了時に必ずゴミ箱へ捨てる。
function testMigrateAll() {
  withTemporarySpreadsheet("migrate", (spreadsheetId) => {
    testMigrateCreateSheet(spreadsheetId);
    testMigrateAppendColumns(spreadsheetId);
    testMigrateNonDestructive(spreadsheetId);
    testMigrateIdempotent(spreadsheetId);
  });

  Logger.log("🎉 All migrate tests passed!");
}

export { testMigrateAll };
