import { getSheetSnapshot } from "./assert/getSheetSnapshot";
import { resetAllSheets } from "./reset/resetAllSheets";
import { resetSheet } from "./reset/resetSheet";
import { testRead } from "./test/read";
import { testCreateAll } from "./test/create";
import { testDeleteAll } from "./test/delete";
import { testUpdateAll } from "./test/update";
import { testUpsertAll } from "./test/upsert";
import { testErrorAll } from "./test/error";
import { testSecurityAll } from "./test/security";
import { testGlobalOmitWriteAll } from "./test/globalOmitWrite";
import { testSettingsAll } from "./test/settings";
import { testFormulaAll } from "./test/formula";

function main() {
  testRead();
  testCreateAll();
  testDeleteAll();
  testUpdateAll();
  testUpsertAll();
  testErrorAll();
  testSecurityAll();
  testGlobalOmitWriteAll();
  testSettingsAll();
  testFormulaAll();
}

export { main, getSheetSnapshot, resetAllSheets, resetSheet, testRead, testCreateAll, testDeleteAll, testUpdateAll, testUpsertAll, testErrorAll, testSecurityAll, testGlobalOmitWriteAll, testSettingsAll, testFormulaAll };
