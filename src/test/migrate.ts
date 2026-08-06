import { withTemporarySpreadsheet } from "./migrate/withTemporarySpreadsheet";
import { testMigrateCreateSheet } from "./migrate/testMigrateCreateSheet";
import { testMigrateAppendColumns } from "./migrate/testMigrateAppendColumns";
import { testMigrateWideGrid } from "./migrate/testMigrateWideGrid";
import { testMigrateNarrowGrid } from "./migrate/testMigrateNarrowGrid";
import { testMigrateNonDestructive } from "./migrate/testMigrateNonDestructive";
import { testMigrateIdempotent } from "./migrate/testMigrateIdempotent";
import { testMigrateActiveSpreadsheet } from "./migrate/testMigrateActiveSpreadsheet";
import { testMigrateDropRequiresFlag } from "./migrate/testMigrateDropRequiresFlag";
import { testMigrateDropColumn } from "./migrate/testMigrateDropColumn";
import { testMigrateDropMultipleColumns } from "./migrate/testMigrateDropMultipleColumns";
import { testMigrateDropTypedValues } from "./migrate/testMigrateDropTypedValues";
import { testMigrateDropEmptyTargets } from "./migrate/testMigrateDropEmptyTargets";
import { testMigrateDropSheet } from "./migrate/testMigrateDropSheet";
import { testMigrateDropIdempotent } from "./migrate/testMigrateDropIdempotent";
import { testMigrateEmptyModel } from "./migrate/testMigrateEmptyModel";
import { testMigratePristineDefaultSheet } from "./migrate/testMigratePristineDefaultSheet";

// migrate は本番フィクスチャ(DB1)へ一切書き込まないため resetAllSheets しない。
// 検証はすべて使い捨てスプレッドシート上で行い、終了時に必ずゴミ箱へ捨てる。
function testMigrateAll() {
  // 「シートがちょうど1枚」を前提にするので専用の使い捨てスプレッドシートで流す
  withTemporarySpreadsheet("migrate-pristine", (spreadsheetId) => {
    testMigratePristineDefaultSheet(spreadsheetId);
  });

  withTemporarySpreadsheet("migrate", (spreadsheetId) => {
    testMigrateCreateSheet(spreadsheetId);
    testMigrateAppendColumns(spreadsheetId);
    testMigrateWideGrid(spreadsheetId);
    testMigrateNarrowGrid(spreadsheetId);
    testMigrateNonDestructive(spreadsheetId);
    testMigrateIdempotent(spreadsheetId);
    testMigrateActiveSpreadsheet(spreadsheetId);

    // acceptDataLoss 系は破壊的なので既存ケースの後に流す。
    // 各ケースは既存シートを現ヘッダーどおり models に含めて守る(dataLossHelpers)。
    testMigrateDropRequiresFlag(spreadsheetId);
    testMigrateDropColumn(spreadsheetId);
    testMigrateDropMultipleColumns(spreadsheetId);
    testMigrateDropTypedValues(spreadsheetId);
    testMigrateDropEmptyTargets(spreadsheetId);
    testMigrateDropSheet(spreadsheetId);
    testMigrateDropIdempotent(spreadsheetId);
    testMigrateEmptyModel(spreadsheetId);
  });

  Logger.log("🎉 All migrate tests passed!");
}

export { testMigrateAll };
