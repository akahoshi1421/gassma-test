import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { categoryData } from "../../consts/categoryData";
import { notificationData } from "../../consts/notificationData";

function testTransactionCommit() {
  const client = new GassmaClient();

  // 複数シート跨ぎの書き込みが fn 完走後にまとめて反映され、戻り値も伝播する
  const result = client.$transaction((tx) => {
    const tag = tx.Tag.create({ data: { name: "TxCommitTag" } });
    tx.Category.update({
      where: { id: 1 },
      data: { name: "TxCommitCategory" },
    });
    tx.Notification.delete({ where: { id: 5 } });
    return tag.name;
  });

  assertEquals(result, "TxCommitTag", "transaction commit: return value");

  const tagSnapshot = getSheetSnapshot("Tag");
  tagSnapshot.assertCount(31);
  tagSnapshot.assertRowExists({ name: "TxCommitTag" });

  const categorySnapshot = getSheetSnapshot("Category");
  categorySnapshot.assertRowEquals({ id: 1 }, { name: "TxCommitCategory" });

  const notificationSnapshot = getSheetSnapshot("notifications");
  notificationSnapshot.assertCount(4);
  notificationSnapshot.assertRowNotExists({ id: 5 });

  resetSheet("Tag", tagData);
  resetSheet("Category", categoryData);
  resetSheet("notifications", notificationData);

  Logger.log("✅ testTransactionCommit: all passed");
}

export { testTransactionCommit };
