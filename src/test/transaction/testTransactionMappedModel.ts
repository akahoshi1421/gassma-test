import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { notificationData } from "../../consts/notificationData";

function testTransactionMappedModel() {
  const client = new GassmaClient();

  // @@map モデル(Notification → notifications シート)の CRUD が tx 内で動く
  const result = client.$transaction((tx) => {
    const created = tx.Notification.create({
      data: { id: 9990, userId: 1, message: "tx mapped create" },
    });
    tx.Notification.update({
      where: { id: 9990 },
      data: { message: "tx mapped updated" },
    });
    tx.Notification.delete({ where: { id: 4 } });
    const found = tx.Notification.findFirstOrThrow({ where: { id: 9990 } });
    return { createdIsRead: created.isRead, foundMessage: found.message };
  });

  // defaults(isRead=false)も tx 内 create で効く
  assertEquals(result.createdIsRead, false, "mapped: default isRead in tx");
  assertEquals(result.foundMessage, "tx mapped updated", "mapped: ryw update");

  const snapshot = getSheetSnapshot("notifications");
  snapshot.assertCount(5);
  snapshot.assertRowEquals(
    { id: 9990 },
    { message: "tx mapped updated", isRead: false },
  );
  snapshot.assertRowNotExists({ id: 4 });

  resetSheet("notifications", notificationData);

  Logger.log("✅ testTransactionMappedModel: all passed");
}

export { testTransactionMappedModel };
