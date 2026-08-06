import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheet, getSheetNames, getHeaderRow } from "./sheetAccess";
import { PRISTINE_MODELS } from "./migrateModels";

// SpreadsheetApp.create 直後の「空の既定シート1枚」だけの状態から流すと、
// 既定シートが消えてモデルのシートだけが残る(acceptDataLoss は不要)。
// 既存の migrate ケースと同じ使い捨てスプレッドシートでは
// 先にシートが作られてしまい「ちょうど1枚」が成立しないので専用に1枚使う。
function testMigratePristineDefaultSheet(spreadsheetId: string) {
  const namesBefore = getSheetNames(spreadsheetId);
  assertEquals(
    namesBefore.length,
    1,
    "migrate pristine: a new spreadsheet holds exactly one sheet",
  );
  const defaultSheetName = namesBefore[0];

  Gassma.migrateSheets({ spreadsheetId, models: PRISTINE_MODELS });

  const namesAfter = getSheetNames(spreadsheetId);
  assertEquals(
    namesAfter.indexOf(defaultSheetName),
    -1,
    "migrate pristine: the empty default sheet is gone",
  );
  assertDeepEquals(
    namesAfter.sort(),
    PRISTINE_MODELS.map((model) => model.name).sort(),
    "migrate pristine: only the model sheets remain",
  );

  // 削除に巻き込まれず、モデルのシートは通常どおり作られている
  PRISTINE_MODELS.forEach((model) => {
    const sheet = getSheet(spreadsheetId, model.name);
    assertDeepEquals(
      getHeaderRow(sheet, model.columns.length),
      model.columns,
      `migrate pristine: header row of "${model.name}"`,
    );
    assertEquals(
      sheet.getLastRow(),
      1,
      `migrate pristine: only the header row is written to "${model.name}"`,
    );
  });

  Logger.log("✅ testMigratePristineDefaultSheet: all passed");
}

export { testMigratePristineDefaultSheet };
