import { testExtendsArgsRewrite } from "./extends/testExtendsArgsRewrite";
import { testExtendsModelOperation } from "./extends/testExtendsModelOperation";
import { testExtendsResultTransform } from "./extends/testExtendsResultTransform";
import { testExtendsBaseImmutable } from "./extends/testExtendsBaseImmutable";
import { testExtendsAllModelsAllOperations } from "./extends/testExtendsAllModelsAllOperations";
import { testExtendsChaining } from "./extends/testExtendsChaining";
import { testExtendsShortCircuit } from "./extends/testExtendsShortCircuit";
import { testExtendsWriteCreate } from "./extends/testExtendsWriteCreate";
import { resetAllSheets } from "../reset/resetAllSheets";

function testExtendsAll() {
  resetAllSheets();
  testExtendsArgsRewrite();
  testExtendsModelOperation();
  testExtendsResultTransform();
  testExtendsBaseImmutable();
  testExtendsAllModelsAllOperations();
  testExtendsChaining();
  testExtendsShortCircuit();
  testExtendsWriteCreate();

  Logger.log("🎉 All extends tests passed!");
}

export { testExtendsAll };
