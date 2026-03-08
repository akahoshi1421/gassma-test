import { getSheetSnapshot } from "./assert/getSheetSnapshot";
import { resetAllSheets } from "./reset/resetAllSheets";
import { resetSheet } from "./reset/resetSheet";
import { testRead } from "./test/read";
import { testCreateAll } from "./test/create";

function main() {
  resetAllSheets();
  testRead();
  testCreateAll();
}

export { main, getSheetSnapshot, resetAllSheets, resetSheet, testRead, testCreateAll };
