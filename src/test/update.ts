import { testUpdate } from "./update/testUpdate";
import { testUpdateMany } from "./update/testUpdateMany";
import { testUpdateInclude } from "./update/testUpdateInclude";
import { testNumberOperation } from "./update/testNumberOperation";
import { testOnUpdate } from "./update/testOnUpdate";
import { testNestedUpdate } from "./update/testNestedUpdate";

function testUpdateAll() {
  testUpdate();
  testUpdateMany();
  testUpdateInclude();
  testNumberOperation();
  testOnUpdate();
  testNestedUpdate();

  Logger.log("🎉 All update tests passed!");
}

export { testUpdateAll };
