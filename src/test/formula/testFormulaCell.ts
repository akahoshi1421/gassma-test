import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { formulaCellData } from "../../consts/formulaCellData";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";

function testFormulaCell() {
  const client = new GassmaClient();

  testFormulaComputedRead(client);
  testFormulaComputedWhere(client);
  testFormulaKeptOnRead();
  testFormulaRowUpdateOtherField(client);
  testFormulaCellDirectUpdate(client);

  Logger.log("✅ testFormulaCell: all passed");
}

function resetFormulaCellSheet() {
  resetSheet("FormulaCell", formulaCellData);
}

// リセット直後は id 順のため、id N の total セルは D(N+1)
function getTotalFormula(id: number): string {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID_DB1).getSheetByName("FormulaCell");
  if (!sheet) throw new Error("FormulaCell sheet not found");
  return sheet.getRange(id + 1, 4).getFormula();
}

function testFormulaComputedRead(client: GassmaClient) {
  const cells = client.FormulaCell.findMany({});
  assertEquals(cells.length, 3, "formula read: count");
  assertDeepEquals(
    cells.map((cell) => cell.total),
    [200, 500, 80],
    "formula read: computed values",
  );
  cells.forEach((cell) => {
    if (typeof cell.total !== "number") {
      throw new Error(`formula read: total should be number, got ${typeof cell.total}`);
    }
  });
}

function testFormulaComputedWhere(client: GassmaClient) {
  const matched = client.FormulaCell.findMany({
    where: { total: { gte: 200 } },
  });
  assertDeepEquals(
    matched.map((cell) => cell.id),
    [1, 2],
    "formula where: gte on computed value",
  );

  const exact = client.FormulaCell.findFirstOrThrow({ where: { total: 500 } });
  assertEquals(exact.id, 2, "formula where: direct value on computed value");
}

function testFormulaKeptOnRead() {
  assertEquals(getTotalFormula(1) !== "", true, "formula kept: read does not destroy formula");
}

// 数式セル以外の列を update しても、行全体書き込みにより数式は計算値(静的値)へ置き換わる
function testFormulaRowUpdateOtherField(client: GassmaClient) {
  assertEquals(getTotalFormula(3) !== "", true, "row update: formula present before");

  client.FormulaCell.update({ where: { id: 3 }, data: { label: "gamma2" } });

  const snapshot = getSheetSnapshot("FormulaCell");
  snapshot.assertRowEquals({ id: 3 }, { label: "gamma2", amount: 40, total: 80 });
  assertEquals(getTotalFormula(3), "", "row update: formula replaced by value");

  resetFormulaCellSheet();
  assertEquals(getTotalFormula(3) !== "", true, "row update: reset restores formula");
}

function testFormulaCellDirectUpdate(client: GassmaClient) {
  client.FormulaCell.update({ where: { id: 2 }, data: { total: 999 } });

  const snapshot = getSheetSnapshot("FormulaCell");
  snapshot.assertRowEquals({ id: 2 }, { total: 999 });
  assertEquals(getTotalFormula(2), "", "direct update: formula replaced by value");

  const updated = client.FormulaCell.findFirstOrThrow({ where: { id: 2 } });
  assertEquals(updated.total, 999, "direct update: ORM read back");

  resetFormulaCellSheet();
  const restored = client.FormulaCell.findFirstOrThrow({ where: { id: 2 } });
  assertEquals(restored.total, 500, "direct update: computed value after reset");
}

export { testFormulaCell };
