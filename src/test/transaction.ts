import { testTransactionCommit } from "./transaction/testTransactionCommit";
import { testTransactionRollback } from "./transaction/testTransactionRollback";
import { testTransactionReadYourWrites } from "./transaction/testTransactionReadYourWrites";
import { testTransactionIsolation } from "./transaction/testTransactionIsolation";
import { testTransactionMappedModel } from "./transaction/testTransactionMappedModel";
import { testTransactionClientOptions } from "./transaction/testTransactionClientOptions";
import { testTransactionAutoincrement } from "./transaction/testTransactionAutoincrement";
import { testTransactionNested } from "./transaction/testTransactionNested";
import { testTransactionTimeout } from "./transaction/testTransactionTimeout";
import { resetAllSheets } from "../reset/resetAllSheets";

function testTransactionAll() {
  resetAllSheets();
  testTransactionCommit();
  testTransactionRollback();
  testTransactionReadYourWrites();
  testTransactionIsolation();
  testTransactionMappedModel();
  testTransactionClientOptions();
  testTransactionAutoincrement();
  testTransactionNested();
  testTransactionTimeout();

  Logger.log("🎉 All transaction tests passed!");
}

export { testTransactionAll };
