import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { formulaCellData } from "../../consts/formulaCellData";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { assertNoBackupResidue } from "./assertNoBackupResidue";

// リセット直後は id 順のため、id N の total セルは D(N+1)
function getTotalFormula(id: number): string {
  const sheet =
    SpreadsheetApp.openById(SPREADSHEET_ID_DB1).getSheetByName("FormulaCell");
  if (!sheet) throw new Error("FormulaCell sheet not found");
  return sheet.getRange(id + 1, 4).getFormula();
}

function testTransactionFormulaCell() {
  const client = new GassmaClient();

  // 数式セルを持つシートへの tx 書き込みでも copyTo バックアップが安全に往復する
  client.$transaction((tx) => {
    tx.FormulaCell.create({
      data: { id: 4, label: "delta", amount: 60, total: 120 },
    });
  });

  const snapshot = getSheetSnapshot("FormulaCell");
  snapshot.assertCount(4);
  snapshot.assertRowEquals({ id: 4 }, { label: "delta", amount: 60, total: 120 });

  // 触っていない既存行の数式は commit 後も壊れていない
  [1, 2, 3].forEach((id) => {
    assertEquals(
      getTotalFormula(id) !== "",
      true,
      `tx formula: id ${id} keeps its formula after commit`,
    );
  });

  const computed = client.FormulaCell.findFirstOrThrow({ where: { id: 2 } });
  assertEquals(computed.total, 500, "tx formula: computed value still reads");

  assertNoBackupResidue("tx formula");

  resetSheet("FormulaCell", formulaCellData);

  Logger.log("✅ testTransactionFormulaCell: all passed");
}

export { testTransactionFormulaCell };
