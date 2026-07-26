import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { categoryData } from "../../consts/categoryData";
import { assertNoBackupResidue } from "./assertNoBackupResidue";

function testTransactionBackupCleanup() {
  const client = new GassmaClient();

  // 既定(rollback: true)の tx が完走したら、copyTo バックアップとマーカーが全掃除される
  const result = client.$transaction((tx) => {
    const tag = tx.Tag.create({ data: { name: "TxCleanupTag" } });
    tx.Category.update({
      where: { id: 2 },
      data: { name: "TxCleanupCategory" },
    });
    return tag.name;
  });

  assertEquals(result, "TxCleanupTag", "backup cleanup: return value");

  const tagSnapshot = getSheetSnapshot("Tag");
  tagSnapshot.assertCount(31);
  tagSnapshot.assertRowExists({ name: "TxCleanupTag" });

  const categorySnapshot = getSheetSnapshot("Category");
  categorySnapshot.assertRowEquals({ id: 2 }, { name: "TxCleanupCategory" });

  assertNoBackupResidue("backup cleanup");

  resetSheet("Tag", tagData);
  resetSheet("Category", categoryData);

  Logger.log("✅ testTransactionBackupCleanup: all passed");
}

export { testTransactionBackupCleanup };
