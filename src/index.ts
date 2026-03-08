import { getSheetSnapshot } from "./assert/getSheetSnapshot";
import { resetAllSheets } from "./reset/resetAllSheets";
import { resetSheet } from "./reset/resetSheet";
import { testRead } from "./test/read";
import { testCreateAll } from "./test/create";
import { testDeleteAll } from "./test/delete";

function main() {
  resetAllSheets();
  testRead();
  testCreateAll();
  testDeleteAll();
}

export { main, getSheetSnapshot, resetAllSheets, resetSheet, testRead, testCreateAll, testDeleteAll };
