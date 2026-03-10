import { testCreate } from "./create/testCreate";
import { testCreateMany } from "./create/testCreateMany";
import { testNestedCreate } from "./create/testNestedCreate";
import { testDefaults } from "./create/testDefaults";
import { testUpdatedAt } from "./create/testUpdatedAt";

function testCreateAll() {
  testCreate();
  testCreateMany();
  testNestedCreate();
  testDefaults();
  testUpdatedAt();

  Logger.log("🎉 All create tests passed!");
}

export { testCreateAll };
