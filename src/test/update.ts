import { testUpdate } from "./update/testUpdate";
import { testUpdateMany } from "./update/testUpdateMany";
import { testUpdateInclude } from "./update/testUpdateInclude";
import { testNumberOperation } from "./update/testNumberOperation";
import { testOnUpdate } from "./update/testOnUpdate";
import { testOnUpdateDateKey } from "./update/testOnUpdateDateKey";
import { testNestedUpdate } from "./update/testNestedUpdate";
import { testNestedOneToOneNonFk } from "./update/testNestedOneToOneNonFk";
import { testUpdateFirstMatch } from "./update/testUpdateFirstMatch";
import { resetAllSheets } from "../reset/resetAllSheets";

function testUpdateAll() {
  resetAllSheets();
  testUpdate();
  testUpdateMany();
  testUpdateInclude();
  testNumberOperation();
  testOnUpdate();
  testOnUpdateDateKey();
  testNestedUpdate();
  testNestedOneToOneNonFk();
  testUpdateFirstMatch();

  Logger.log("🎉 All update tests passed!");
}

export { testUpdateAll };
