import { testDelete } from "./delete/testDelete";
import { testDeleteMany } from "./delete/testDeleteMany";
import { testOnDelete } from "./delete/testOnDelete";
import { resetAllSheets } from "../reset/resetAllSheets";

function testDeleteAll() {
  resetAllSheets();
  testDelete();
  testDeleteMany();
  testOnDelete();

  Logger.log("🎉 All delete tests passed!");
}

export { testDeleteAll };
