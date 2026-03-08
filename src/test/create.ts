import { testCreate } from "./create/testCreate";
import { testCreateMany } from "./create/testCreateMany";
import { testNestedCreate } from "./create/testNestedCreate";

function testCreateAll() {
  testCreate();
  testCreateMany();
  testNestedCreate();

  Logger.log("🎉 All create tests passed!");
}

export { testCreateAll };
