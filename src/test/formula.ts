import { testFormulaCell } from "./formula/testFormulaCell";
import { resetSheet } from "../reset/resetSheet";
import { formulaCellData } from "../consts/formulaCellData";

function testFormulaAll() {
  resetSheet("FormulaCell", formulaCellData);
  testFormulaCell();

  Logger.log("🎉 All formula tests passed!");
}

export { testFormulaAll };
