import { testErrorCases } from "./error/testErrorCases";
import { testErrorClasses } from "./error/testErrorClasses";
import { testLibrarySurface } from "./error/testLibrarySurface";
import { resetAllSheets } from "../reset/resetAllSheets";

function testErrorAll() {
  resetAllSheets();
  testErrorCases();
  testErrorClasses();
  testLibrarySurface();

  Logger.log("🎉 All error tests passed!");
}

export { testErrorAll };
