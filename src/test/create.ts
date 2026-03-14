import { testCreate } from "./create/testCreate";
import { testCreateMany } from "./create/testCreateMany";
import { testNestedCreate } from "./create/testNestedCreate";
import { testDefaults } from "./create/testDefaults";
import { testUpdatedAt } from "./create/testUpdatedAt";
import { testAutoincrement } from "./create/testAutoincrement";

function testCreateAll() {
  testCreate();
  testCreateMany();
  testNestedCreate();
  testDefaults();
  testUpdatedAt();
  testAutoincrement();

  Logger.log("🎉 All create tests passed!");
}

export { testCreateAll };
