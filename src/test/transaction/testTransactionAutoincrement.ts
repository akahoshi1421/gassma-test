import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { notificationData } from "../../consts/notificationData";

function testTransactionAutoincrement() {
  const client = new GassmaClient();

  // tx がスクリプトロック保持中でも autoincrement(内部でロック取得)が動くことの実機確認
  const created = client.$transaction((tx) =>
    tx.Notification.create({
      data: { userId: 1, message: "tx autoincrement" },
    }),
  );

  if (typeof created.id !== "number" || created.id <= 0) {
    throw new Error(`tx autoincrement: invalid id ${created.id}`);
  }

  const found = client.Notification.findMany({
    where: { message: "tx autoincrement" },
  });
  assertEquals(found.length, 1, "tx autoincrement: flushed row count");
  assertEquals(found[0].id, created.id, "tx autoincrement: id persisted");

  resetSheet("notifications", notificationData);

  Logger.log("✅ testTransactionAutoincrement: all passed");
}

export { testTransactionAutoincrement };
