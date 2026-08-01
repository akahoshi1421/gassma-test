import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { formulaCellData } from "../../consts/formulaCellData";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";

function testRawValue() {
  const client = new GassmaClient();

  testRawCreateWritesFormula(client);
  testRawDoesNotPropagateInRow(client);
  testRawUpdateWritesFormula(client);
  testRawInTransaction(client);

  Logger.log("✅ testRawValue: all passed");
}

function resetFormulaCellSheet() {
  resetSheet("FormulaCell", formulaCellData);
}

// リセット直後は id 順で全 4 行(header + id 1..3)のため、create の追記先は行 5 で確定する
function getCellFormula(row: number, col: number): string {
  const sheet =
    SpreadsheetApp.openById(SPREADSHEET_ID_DB1).getSheetByName("FormulaCell");
  if (!sheet) throw new Error("FormulaCell sheet not found");
  return sheet.getRange(row, col).getFormula();
}

function testRawCreateWritesFormula(client: GassmaClient) {
  const created = client.FormulaCell.create({
    data: { id: 4, label: "delta", amount: 60, total: Gassma.raw("=C5*2") },
  });

  // 戻り値は「書き込んだ内容のエコー」= 数式文字列(計算結果 120 ではない)
  assertEquals(
    String(created.total),
    "=C5*2",
    "raw create: return value echoes the formula string",
  );

  // セルには本物の数式として書かれている
  assertEquals(
    getCellFormula(5, 4),
    "=C5*2",
    "raw create: cell holds a live formula",
  );

  // 再読すると計算結果の数値が返る
  const readBack = client.FormulaCell.findFirstOrThrow({ where: { id: 4 } });
  assertEquals(readBack.total, 120, "raw create: ORM reads computed value");

  resetFormulaCellSheet();
}

function testRawDoesNotPropagateInRow(client: GassmaClient) {
  // raw セルと同じ行でも、raw を使わない文字列は従来どおりエスケープされ文字列のまま
  client.FormulaCell.create({
    data: { id: 4, label: "=1+2", amount: 60, total: Gassma.raw("=C5*2") },
  });

  assertEquals(
    getCellFormula(5, 2),
    "",
    "escape contrast: plain string cell is not a formula",
  );
  assertEquals(
    getCellFormula(5, 4),
    "=C5*2",
    "escape contrast: raw cell in the same row is a formula",
  );

  const readBack = client.FormulaCell.findFirstOrThrow({ where: { id: 4 } });
  assertEquals(
    readBack.label,
    "=1+2",
    "escape contrast: escaped cell reads back as literal string",
  );
  assertEquals(readBack.total, 120, "escape contrast: raw cell computes");

  resetFormulaCellSheet();
}

function testRawUpdateWritesFormula(client: GassmaClient) {
  // id 1 は行 2。amount 100 なので =C2*3 → 300
  const updated = client.FormulaCell.update({
    where: { id: 1 },
    data: { total: Gassma.raw("=C2*3") },
  });
  if (!updated) throw new Error("raw update: update returned null");

  assertEquals(
    String(updated.total),
    "=C2*3",
    "raw update: return value echoes the formula string",
  );
  assertEquals(
    getCellFormula(2, 4),
    "=C2*3",
    "raw update: cell holds the new formula",
  );

  const readBack = client.FormulaCell.findFirstOrThrow({ where: { id: 1 } });
  assertEquals(readBack.total, 300, "raw update: ORM reads computed value");

  resetFormulaCellSheet();
}

function testRawInTransaction(client: GassmaClient) {
  client.$transaction((tx) => {
    tx.FormulaCell.create({
      data: {
        id: 4,
        label: "tx-delta",
        amount: 60,
        total: Gassma.raw("=C5*2"),
      },
    });

    // tx 内 read-your-writes ではまだ数式文字列のまま見える(flush 前)
    const buffered = tx.FormulaCell.findFirstOrThrow({ where: { id: 4 } });
    assertEquals(
      String(buffered.total),
      "=C5*2",
      "raw tx: buffered read sees the formula string",
    );
  });

  // commit(flush)後はセルに数式として書かれ、計算結果が読める
  assertEquals(
    getCellFormula(5, 4),
    "=C5*2",
    "raw tx: cell holds a live formula after commit",
  );
  const readBack = client.FormulaCell.findFirstOrThrow({ where: { id: 4 } });
  assertEquals(readBack.total, 120, "raw tx: ORM reads computed value");

  resetFormulaCellSheet();
}

export { testRawValue };
