import { testCreate } from "./create/testCreate";
import { testCreateMany } from "./create/testCreateMany";
import { testCreateManyAndReturnOptions } from "./create/testCreateManyAndReturnOptions";
import { testCreateInclude } from "./create/testCreateInclude";
import { testNestedCreate } from "./create/testNestedCreate";
import { testDefaults } from "./create/testDefaults";
import { testUpdatedAt } from "./create/testUpdatedAt";
import { testAutoincrement } from "./create/testAutoincrement";
import { testCustomTypeValues } from "./create/testCustomTypeValues";
import { testDb2Write } from "./create/testDb2Write";
import { resetAllSheets } from "../reset/resetAllSheets";

function testCreateAll() {
  resetAllSheets();
  testCreate();
  testCreateMany();
  testCreateManyAndReturnOptions();
  testCreateInclude();
  testNestedCreate();
  testDefaults();
  testUpdatedAt();
  testAutoincrement();
  testCustomTypeValues();
  testDb2Write();

  Logger.log("🎉 All create tests passed!");
}

export { testCreateAll };
