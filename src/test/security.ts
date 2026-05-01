import { testInjection } from "./security/testInjection";
import { resetAllSheets } from "../reset/resetAllSheets";

function testSecurityAll() {
  resetAllSheets();
  testInjection();

  Logger.log("🎉 All security tests passed!");
}

export { testSecurityAll };
