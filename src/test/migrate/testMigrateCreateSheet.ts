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

  const namesAfter = getSheetNames(spreadsheetId);
  assertEquals(
    namesAfter.length,
    namesBefore.length + 1,
    "migrate create: exactly one sheet added",
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
