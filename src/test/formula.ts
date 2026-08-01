import { testFormulaCell } from "./formula/testFormulaCell";
import { testRawValue } from "./formula/testRawValue";
import { resetSheet } from "../reset/resetSheet";
import { formulaCellData } from "../consts/formulaCellData";

function testFormulaAll() {
  resetSheet("FormulaCell", formulaCellData);
  testFormulaCell();
  testRawValue();

  Logger.log("🎉 All formula tests passed!");
}

export { testFormulaAll };
