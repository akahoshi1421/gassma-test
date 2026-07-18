import { testErrorCases } from "./error/testErrorCases";
import { testErrorClasses } from "./error/testErrorClasses";
import { resetAllSheets } from "../reset/resetAllSheets";

function testErrorAll() {
  resetAllSheets();
  testErrorCases();
  testErrorClasses();

  Logger.log("🎉 All error tests passed!");
}

export { testErrorAll };
