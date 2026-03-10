import { testCreate } from "./create/testCreate";
import { testCreateMany } from "./create/testCreateMany";
import { testNestedCreate } from "./create/testNestedCreate";
import { testDefaults } from "./create/testDefaults";

function testCreateAll() {
  testCreate();
  testCreateMany();
  testNestedCreate();
  testDefaults();

  Logger.log("🎉 All create tests passed!");
}

export { testCreateAll };
