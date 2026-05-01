import { testErrorCases } from "./error/testErrorCases";
import { resetAllSheets } from "../reset/resetAllSheets";

function testErrorAll() {
  resetAllSheets();
  testErrorCases();

  Logger.log("🎉 All error tests passed!");
}

export { testErrorAll };
