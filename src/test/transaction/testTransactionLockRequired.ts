import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { captureError } from "./captureError";

// 生成クライアントは常に lock を渡すため、lock 無しの状態は
// ライブラリ直呼び(Gassma グローバル)でしか作れない。
function testTransactionLockRequired() {
  const locklessClient = new Gassma.GassmaClient({ id: SPREADSHEET_ID_DB1 });

  const error = captureError(() => {
    locklessClient.$transaction((tx) => {
      tx.Tag.create({ data: { name: "TxLockRequiredTag" } });
    });
  }, "transaction without lock");

  assertEquals(
    error instanceof Gassma.GassmaTransactionLockRequiredError,
    true,
    "lock required: instanceof GassmaTransactionLockRequiredError",
  );

  // lock の検査はコールバックを呼ぶ前なのでシートは無変化
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowNotExists({ name: "TxLockRequiredTag" });

  Logger.log("✅ testTransactionLockRequired: all passed");
}

export { testTransactionLockRequired };
