import { testCreate } from "./create/testCreate";
import { testCreateMany } from "./create/testCreateMany";
import { testCreateManyAndReturnOptions } from "./create/testCreateManyAndReturnOptions";
import { testCreateInclude } from "./create/testCreateInclude";
import { testNestedCreate } from "./create/testNestedCreate";
import { testDefaults } from "./create/testDefaults";
import { testUpdatedAt } from "./create/testUpdatedAt";
import { testAutoincrement } from "./create/testAutoincrement";

function testCreateAll() {
  testCreate();
  testCreateMany();
  testCreateManyAndReturnOptions();
  testCreateInclude();
  testNestedCreate();
  testDefaults();
  testUpdatedAt();
  testAutoincrement();

  Logger.log("🎉 All create tests passed!");
}

export { testCreateAll };
