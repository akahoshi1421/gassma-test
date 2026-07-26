import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { captureError } from "./captureError";

function testTransactionTimeout() {
  const client = new GassmaClient();

  // timeout 超過で commit されず GassmaTransactionTimeoutError
  const error = captureError(() => {
    client.$transaction(
      (tx) => {
        tx.Tag.create({ data: { name: "TxTimeoutTag" } });
        Utilities.sleep(120);
      },
      { timeout: 50 },
    );
  }, "transaction timeout");

  assertEquals(
    error instanceof Gassma.GassmaTransactionTimeoutError,
    true,
    "timeout: instanceof GassmaTransactionTimeoutError",
  );
  const message = error instanceof Error ? error.message : String(error);
  if (message.indexOf("expired transaction") === -1) {
    throw new Error(`timeout: unexpected message "${message}"`);
  }

  // シートは無変化
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowNotExists({ name: "TxTimeoutTag" });

  Logger.log("✅ testTransactionTimeout: all passed");
}

export { testTransactionTimeout };
