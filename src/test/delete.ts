import { testDelete } from "./delete/testDelete";
import { testDeleteMany } from "./delete/testDeleteMany";
import { testOnDelete } from "./delete/testOnDelete";

function testDeleteAll() {
  testDelete();
  testDeleteMany();
  testOnDelete();

  Logger.log("🎉 All delete tests passed!");
}

export { testDeleteAll };
