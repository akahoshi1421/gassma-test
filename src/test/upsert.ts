import { testUpsert } from "./upsert/testUpsert";
import { resetAllSheets } from "../reset/resetAllSheets";

function testUpsertAll() {
  resetAllSheets();
  testUpsert();

  Logger.log("🎉 All upsert tests passed!");
}

export { testUpsertAll };
