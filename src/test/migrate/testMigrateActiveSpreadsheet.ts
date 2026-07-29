import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { getSheet, getSheetNames, getHeaderRow } from "./sheetAccess";
import { fingerprintSheet } from "./fingerprintSpreadsheet";

const ACTIVE_TARGET_SHEETS = ["Tag", "Category"];

// 実在シートの現ヘッダーをそのまま models に渡すことで、
// 本番フィクスチャに対しては確実に no-op(読み取りのみ)になる定義を組み立てる
function readModelFromSheet(sheetName: string): Gassma.MigrateModel {
  const sheet = getSheet(SPREADSHEET_ID_DB1, sheetName);
  return { name: sheetName, columns: getHeaderRow(sheet, sheet.getLastColumn()) };
}

function fingerprintTargets() {
  return ACTIVE_TARGET_SHEETS.map((sheetName) =>
    fingerprintSheet(getSheet(SPREADSHEET_ID_DB1, sheetName)),
  );
}

function testMigrateActiveSpreadsheet(temporarySpreadsheetId: string) {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  assertEquals(
    active !== null && active.getId() === SPREADSHEET_ID_DB1,
    true,
    "migrate active: this script is bound to DB1",
  );

  const models = ACTIVE_TARGET_SHEETS.map(readModelFromSheet);
  const namesBefore = getSheetNames(SPREADSHEET_ID_DB1);
  const targetsBefore = fingerprintTargets();

  // spreadsheetId 未指定 → アクティブなスプレッドシート(= DB1)が対象
  Gassma.migrateSheets({ models });

  assertDeepEquals(
    getSheetNames(SPREADSHEET_ID_DB1),
    namesBefore,
    "migrate active: no sheet added to or removed from the bound spreadsheet",
  );
  assertDeepEquals(
    fingerprintTargets(),
    targetsBefore,
    "migrate active: already-synced sheets are left byte-identical",
  );

  // 直前に開いていた使い捨てスプレッドシートへ流れ込んでいないこと
  const temporaryNames = getSheetNames(temporarySpreadsheetId);
  ACTIVE_TARGET_SHEETS.forEach((sheetName) => {
    assertEquals(
      temporaryNames.indexOf(sheetName),
      -1,
      `migrate active: "${sheetName}" was not created in the temporary spreadsheet`,
    );
  });

  Logger.log("✅ testMigrateActiveSpreadsheet: all passed");
}

export { testMigrateActiveSpreadsheet };
