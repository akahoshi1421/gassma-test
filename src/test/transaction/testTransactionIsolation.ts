import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";

function testTransactionIsolation() {
  const client = new GassmaClient();

  const observed: number[] = [];
  client.$transaction((tx) => {
    tx.Tag.create({ data: { name: "TxIsolationTag" } });
    // 未 flush の変更は外側 client(シート直読み)には見えない
    observed.push(client.Tag.count({ where: { name: "TxIsolationTag" } }));
    observed.push(tx.Tag.count({ where: { name: "TxIsolationTag" } }));
  });

  assertEquals(observed[0], 0, "isolation: outer client cannot see buffered write");
  assertEquals(observed[1], 1, "isolation: tx sees its own write");
  assertEquals(
    client.Tag.count({ where: { name: "TxIsolationTag" } }),
    1,
    "isolation: visible after flush",
  );

  resetSheet("Tag", tagData);

  Logger.log("✅ testTransactionIsolation: all passed");
}

export { testTransactionIsolation };
