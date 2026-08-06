import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, getSheetNames, getHeaderRow } from "./sheetAccess";
import { CREATE_MODEL } from "./migrateModels";

function testMigrateCreateSheet(spreadsheetId: string) {
  const namesBefore = getSheetNames(spreadsheetId);
  assertEquals(
    namesBefore.indexOf(CREATE_MODEL.name),
    -1,
    "migrate create: sheet does not exist yet",
  );

  Gassma.migrateSheets({ spreadsheetId, models: [CREATE_MODEL] });

  // 使い捨てスプレッドシートへの最初の実行なので、空の既定シートも同時に消える
  // (testMigratePristineDefaultSheet)
  assertDeepEquals(
    getSheetNames(spreadsheetId),
    [CREATE_MODEL.name],
    "migrate create: the model sheet replaces the empty default sheet",
  );

  const sheet = getSheet(spreadsheetId, CREATE_MODEL.name);
  assertDeepEquals(
    getHeaderRow(sheet, CREATE_MODEL.columns.length),
    CREATE_MODEL.columns,
    "migrate create: header row follows schema order",
  );
  assertEquals(
    sheet.getLastColumn(),
    CREATE_MODEL.columns.length,
    "migrate create: no extra column written",
  );
  assertEquals(
    sheet.getLastRow(),
    1,
    "migrate create: only the header row is written",
  );

  Logger.log("✅ testMigrateCreateSheet: all passed");
}

export { testMigrateCreateSheet };
