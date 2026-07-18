import { testDelete } from "./delete/testDelete";
import { testDeleteMany } from "./delete/testDeleteMany";
import { testOnDelete } from "./delete/testOnDelete";
import { testSetNullReadBack } from "./delete/testSetNullReadBack";
import { resetAllSheets } from "../reset/resetAllSheets";

function testDeleteAll() {
  resetAllSheets();
  testDelete();
  testDeleteMany();
  testOnDelete();
  testSetNullReadBack();

  Logger.log("🎉 All delete tests passed!");
}

export { testDeleteAll };
