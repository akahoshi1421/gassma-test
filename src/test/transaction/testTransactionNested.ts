import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { captureError } from "./captureError";

function testTransactionNested() {
  const client = new GassmaClient();

  // tx 実行中に外側 client の $transaction を呼ぶとネスト tx エラー
  const viaOuterClient = captureError(() => {
    client.$transaction(() => {
      client.$transaction((tx2) => tx2.Tag.count({}));
    });
  }, "nested tx via outer client");
  assertEquals(
    viaOuterClient instanceof Gassma.GassmaNestedTransactionError,
    true,
    "nested tx (outer client): instanceof GassmaNestedTransactionError",
  );

  // tx オブジェクト自身の $transaction(型には無い実行時プロパティ)も同エラー
  const viaTx = captureError(() => {
    client.$transaction((tx) => {
      const txRuntime: {
        $extends?: unknown;
        $transaction?: (fn: (t: unknown) => unknown) => unknown;
      } = tx;
      if (!txRuntime.$transaction) {
        throw new Error("nested tx: tx.$transaction not exposed at runtime");
      }
      txRuntime.$transaction(() => null);
    });
  }, "nested tx via tx client");
  assertEquals(
    viaTx instanceof Gassma.GassmaNestedTransactionError,
    true,
    "nested tx (tx client): instanceof GassmaNestedTransactionError",
  );

  Logger.log("✅ testTransactionNested: all passed");
}

export { testTransactionNested };
