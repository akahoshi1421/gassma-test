import { testErrorCases } from "./error/testErrorCases";
import { testErrorClasses } from "./error/testErrorClasses";
import { testMissingArguments } from "./error/testMissingArguments";
import { testLibrarySurface } from "./error/testLibrarySurface";
import { resetAllSheets } from "../reset/resetAllSheets";

function testErrorAll() {
  resetAllSheets();
  testErrorCases();
  testErrorClasses();
  testMissingArguments();
  testLibrarySurface();

  Logger.log("🎉 All error tests passed!");
}

export { testErrorAll };
