import { testTransactionCommit } from "./transaction/testTransactionCommit";
import { testTransactionRollback } from "./transaction/testTransactionRollback";
import { testTransactionBulkWrite } from "./transaction/testTransactionBulkWrite";
import { testTransactionReadYourWrites } from "./transaction/testTransactionReadYourWrites";
import { testTransactionIsolation } from "./transaction/testTransactionIsolation";
import { testTransactionMappedModel } from "./transaction/testTransactionMappedModel";
import { testTransactionClientOptions } from "./transaction/testTransactionClientOptions";
import { testTransactionAutoincrement } from "./transaction/testTransactionAutoincrement";
import { testTransactionNested } from "./transaction/testTransactionNested";
import { testTransactionTimeout } from "./transaction/testTransactionTimeout";
import { testTransactionBackupCleanup } from "./transaction/testTransactionBackupCleanup";
import { testTransactionRollbackDisabled } from "./transaction/testTransactionRollbackDisabled";
import { testTransactionFormulaCell } from "./transaction/testTransactionFormulaCell";
import { testTransactionLockRequired } from "./transaction/testTransactionLockRequired";
import { resetAllSheets } from "../reset/resetAllSheets";

function testTransactionAll() {
  resetAllSheets();
  testTransactionCommit();
  testTransactionRollback();
  testTransactionBulkWrite();
  testTransactionReadYourWrites();
  testTransactionIsolation();
  testTransactionMappedModel();
  testTransactionClientOptions();
  testTransactionAutoincrement();
  testTransactionNested();
  testTransactionTimeout();
  testTransactionBackupCleanup();
  testTransactionRollbackDisabled();
  testTransactionFormulaCell();
  testTransactionLockRequired();

  Logger.log("🎉 All transaction tests passed!");
}

export { testTransactionAll };
