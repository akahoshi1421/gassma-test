import { testUpsert } from "./upsert/testUpsert";
import { testUpsertCreatePath } from "./upsert/testUpsertCreatePath";
import { testUpsertAutoincrement } from "./upsert/testUpsertAutoincrement";
import { resetAllSheets } from "../reset/resetAllSheets";

function testUpsertAll() {
  resetAllSheets();
  testUpsert();
  testUpsertCreatePath();
  testUpsertAutoincrement();

  Logger.log("🎉 All upsert tests passed!");
}

export { testUpsertAll };
