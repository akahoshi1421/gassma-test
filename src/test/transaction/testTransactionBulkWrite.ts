import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { captureError } from "./captureError";

function testTransactionBulkWrite() {
  const client = new GassmaClient();

  testBulkWriteCommit(client);
  testBulkWriteRollback(client);

  Logger.log("✅ testTransactionBulkWrite: all passed");
}

function testBulkWriteCommit(client: GassmaClient) {
  // 連続行への updateMany / deleteMany と、削除で行位置がずれた後の updateMany を同一 tx で commit
  const counts = client.$transaction((tx) => {
    const updated = tx.Tag.updateMany({
      where: { id: { lte: 5 } },
      data: { name: "TxBulkUpdate" },
    });
    const deleted = tx.Tag.deleteMany({
      where: { id: { in: [11, 12, 13, 14] } },
    });
    const updatedAfterDelete = tx.Tag.updateMany({
      where: { id: { in: [21, 22, 23] } },
      data: { name: "TxBulkAfterDelete" },
    });
    return {
      updated: updated.count,
      deleted: deleted.count,
      updatedAfterDelete: updatedAfterDelete.count,
    };
  });

  assertEquals(counts.updated, 5, "bulk write commit: updateMany count");
  assertEquals(counts.deleted, 4, "bulk write commit: deleteMany count");
  assertEquals(
    counts.updatedAfterDelete,
    3,
    "bulk write commit: updateMany count after delete",
  );

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(26);

  snapshot.assertRowEquals({ id: 1 }, { name: "TxBulkUpdate" });
  snapshot.assertRowEquals({ id: 2 }, { name: "TxBulkUpdate" });
  snapshot.assertRowEquals({ id: 3 }, { name: "TxBulkUpdate" });
  snapshot.assertRowEquals({ id: 4 }, { name: "TxBulkUpdate" });
  snapshot.assertRowEquals({ id: 5 }, { name: "TxBulkUpdate" });
  snapshot.assertRowEquals({ id: 6 }, { name: "Python" });

  snapshot.assertRowNotExists({ id: 11 });
  snapshot.assertRowNotExists({ id: 12 });
  snapshot.assertRowNotExists({ id: 13 });
  snapshot.assertRowNotExists({ id: 14 });
  snapshot.assertRowEquals({ id: 10 }, { name: "Kubernetes" });
  snapshot.assertRowEquals({ id: 15 }, { name: "REST" });

  snapshot.assertRowEquals({ id: 21 }, { name: "TxBulkAfterDelete" });
  snapshot.assertRowEquals({ id: 22 }, { name: "TxBulkAfterDelete" });
  snapshot.assertRowEquals({ id: 23 }, { name: "TxBulkAfterDelete" });
  snapshot.assertRowEquals({ id: 20 }, { name: "Git" });
  snapshot.assertRowEquals({ id: 24 }, { name: "パフォーマンス" });
  snapshot.assertRowEquals({ id: 30 }, { name: "クラウド" });

  resetSheet("Tag", tagData);
}

function testBulkWriteRollback(client: GassmaClient) {
  const error = captureError(() => {
    client.$transaction((tx) => {
      tx.Tag.updateMany({
        where: { id: { lte: 5 } },
        data: { name: "TxBulkRollback" },
      });
      tx.Tag.deleteMany({ where: { id: { in: [11, 12, 13, 14] } } });
      throw new Error("tx bulk rollback marker");
    });
  }, "transaction bulk write rollback");

  const message = error instanceof Error ? error.message : String(error);
  if (message.indexOf("tx bulk rollback marker") === -1) {
    throw new Error(
      `transaction bulk write rollback: unexpected error "${message}"`,
    );
  }

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowNotExists({ name: "TxBulkRollback" });
  snapshot.assertRowEquals({ id: 1 }, { name: "JavaScript" });
  snapshot.assertRowEquals({ id: 5 }, { name: "Node.js" });
  snapshot.assertRowEquals({ id: 11 }, { name: "AWS" });
  snapshot.assertRowEquals({ id: 14 }, { name: "GraphQL" });
}

export { testTransactionBulkWrite };
