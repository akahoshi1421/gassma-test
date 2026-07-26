import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { captureError } from "./captureError";

function testTransactionRollback() {
  const client = new GassmaClient();

  const error = captureError(() => {
    client.$transaction((tx) => {
      tx.Tag.create({ data: { name: "TxRollbackTag" } });
      tx.Category.update({
        where: { id: 1 },
        data: { name: "TxRollbackCategory" },
      });
      tx.Notification.delete({ where: { id: 5 } });
      throw new Error("tx rollback marker");
    });
  }, "transaction rollback");

  // ユーザーの throw がそのまま rethrow される
  const message = error instanceof Error ? error.message : String(error);
  if (message.indexOf("tx rollback marker") === -1) {
    throw new Error(`transaction rollback: unexpected error "${message}"`);
  }

  // 1 セルも書かれていない(件数 + 代表セル)
  const tagSnapshot = getSheetSnapshot("Tag");
  tagSnapshot.assertCount(30);
  tagSnapshot.assertRowNotExists({ name: "TxRollbackTag" });

  const categorySnapshot = getSheetSnapshot("Category");
  categorySnapshot.assertCount(20);
  categorySnapshot.assertRowEquals({ id: 1 }, { name: "テクノロジー" });

  const notificationSnapshot = getSheetSnapshot("notifications");
  notificationSnapshot.assertCount(5);
  notificationSnapshot.assertRowExists({ id: 5 });

  Logger.log("✅ testTransactionRollback: all passed");
}

export { testTransactionRollback };
