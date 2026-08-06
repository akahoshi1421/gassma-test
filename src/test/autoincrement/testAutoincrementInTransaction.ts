import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { captureError } from "./captureError";

// カウンタは ScriptProperties にあり rollback されないため、
// tx 内で動かす $set / $sync は拒否され、読むだけの $get は通る。
function testAutoincrementInTransaction(client: GassmaClient) {
  testGetIsAllowedInTransaction(client);
  testMutatorsAreRejectedInTransaction(client);

  Logger.log("✅ testAutoincrementInTransaction: all passed");
}

function testGetIsAllowedInTransaction(client: GassmaClient) {
  const outside = client.Notification.$getAutoincrement("id");

  const inside = client.$transaction((tx) =>
    tx.Notification.$getAutoincrement("id"),
  );

  assertEquals(
    inside,
    outside,
    "tx counter: $getAutoincrement reads the same value inside a transaction",
  );
}

function testMutatorsAreRejectedInTransaction(client: GassmaClient) {
  const before = client.Notification.$getAutoincrement("id");

  const mutators: [string, () => void][] = [
    [
      "$setAutoincrement",
      () => {
        client.$transaction((tx) => {
          tx.Notification.$setAutoincrement("id", 1);
        });
      },
    ],
    [
      "$syncAutoincrement",
      () => {
        client.$transaction((tx) => {
          tx.Notification.$syncAutoincrement("id");
        });
      },
    ],
  ];

  mutators.forEach(([methodName, call]) => {
    const error = captureError(call, `${methodName} inside $transaction`);
    assertEquals(
      error instanceof Gassma.GassmaAutoincrementInTransactionError,
      true,
      `tx counter ${methodName}: instanceof GassmaAutoincrementInTransactionError`,
    );
    const message = error instanceof Error ? error.message : String(error);
    if (message.indexOf("cannot be called inside $transaction") === -1) {
      throw new Error(
        `tx counter ${methodName}: unexpected message "${message}"`,
      );
    }
  });

  // 拒否は書き込み前に起きるのでカウンタもシートも動かない
  assertEquals(
    client.Notification.$getAutoincrement("id"),
    before,
    "tx counter: a rejected mutator leaves the counter untouched",
  );
  getSheetSnapshot("notifications").assertCount(5);
}

export { testAutoincrementInTransaction };
