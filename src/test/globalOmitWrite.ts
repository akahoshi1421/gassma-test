import { testGlobalOmitWrite } from "./globalOmitWrite/testGlobalOmitWrite";
import { resetAllSheets } from "../reset/resetAllSheets";

function testGlobalOmitWriteAll() {
  resetAllSheets();
  testGlobalOmitWrite();

  Logger.log("🎉 All globalOmit write tests passed!");
}

export { testGlobalOmitWriteAll };
