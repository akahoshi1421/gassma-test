import { testExtendsArgsRewrite } from "./extends/testExtendsArgsRewrite";
import { testExtendsModelOperation } from "./extends/testExtendsModelOperation";
import { testExtendsResultTransform } from "./extends/testExtendsResultTransform";
import { testExtendsBaseImmutable } from "./extends/testExtendsBaseImmutable";
import { testExtendsAllModelsAllOperations } from "./extends/testExtendsAllModelsAllOperations";
import { testExtendsChaining } from "./extends/testExtendsChaining";
import { testExtendsShortCircuit } from "./extends/testExtendsShortCircuit";
import { testExtendsWriteCreate } from "./extends/testExtendsWriteCreate";
import { testExtendsResultBasic } from "./extends/testExtendsResultBasic";
import { testExtendsResultAllModels } from "./extends/testExtendsResultAllModels";
import { testExtendsResultSelectOmit } from "./extends/testExtendsResultSelectOmit";
import { testExtendsResultOverrideDependency } from "./extends/testExtendsResultOverrideDependency";
import { testExtendsResultNested } from "./extends/testExtendsResultNested";
import { testExtendsResultNestedDeep } from "./extends/testExtendsResultNestedDeep";
import { testExtendsResultNestedAllModels } from "./extends/testExtendsResultNestedAllModels";
import { testExtendsResultWrite } from "./extends/testExtendsResultWrite";
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
  testExtendsResultBasic();
  testExtendsResultAllModels();
  testExtendsResultSelectOmit();
  testExtendsResultOverrideDependency();
  testExtendsResultNested();
  testExtendsResultNestedDeep();
  testExtendsResultNestedAllModels();
  testExtendsWriteCreate();
  testExtendsResultWrite();

  Logger.log("🎉 All extends tests passed!");
}

export { testExtendsAll };
