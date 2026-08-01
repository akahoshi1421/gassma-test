import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetNames, createSheetWith } from "./sheetAccess";
import { fingerprintSpreadsheet } from "./fingerprintSpreadsheet";
import type { SheetFingerprint } from "./fingerprintSpreadsheet";
import { migrateWithDataLoss } from "./dataLossHelpers";
import {
  DROP_SHEET_NAME,
  DROP_SHEET_HEADERS,
  DROP_SHEET_ROWS,
} from "./dataLossModels";

const byName = (a: SheetFingerprint, b: SheetFingerprint) =>
  a.name < b.name ? -1 : 1;

// schema に無いシートはデータ入りでもシートごと消えること。
// 巻き添えが最も怖いケースなので、残る全シートは中身まで一致で残ることを見る。
function testMigrateDropSheet(spreadsheetId: string) {
  createSheetWith(
    spreadsheetId,
    DROP_SHEET_NAME,
    DROP_SHEET_HEADERS,
    DROP_SHEET_ROWS,
  );
  const survivorsBefore = fingerprintSpreadsheet(spreadsheetId)
    .filter((fingerprint) => fingerprint.name !== DROP_SHEET_NAME)
    .sort(byName);

  migrateWithDataLoss(spreadsheetId, [], [DROP_SHEET_NAME]);

  assertEquals(
    getSheetNames(spreadsheetId).indexOf(DROP_SHEET_NAME),
    -1,
    "migrate drop sheet: sheet removed even though it held data",
  );
  assertDeepEquals(
    fingerprintSpreadsheet(spreadsheetId).sort(byName),
    survivorsBefore,
    "migrate drop sheet: every other sheet survives with identical content",
  );

  Logger.log("✅ testMigrateDropSheet: all passed");
}

export { testMigrateDropSheet };
