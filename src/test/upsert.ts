import { testUpsert } from "./upsert/testUpsert";
import { testUpsertCreatePath } from "./upsert/testUpsertCreatePath";
import { resetAllSheets } from "../reset/resetAllSheets";

function testUpsertAll() {
  resetAllSheets();
  testUpsert();
  testUpsertCreatePath();

  Logger.log("🎉 All upsert tests passed!");
}

export { testUpsertAll };
