import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { assertNoBackupResidue } from "./assertNoBackupResidue";

function testTransactionRollbackDisabled() {
  const client = new GassmaClient();

  // rollback: false でも commit は通常どおり反映され、バックアップ資材は一切作られない
  const result = client.$transaction(
    (tx) => {
      const tag = tx.Tag.create({ data: { name: "TxNoRollbackTag" } });
      return tag.name;
    },
    { rollback: false },
  );

  assertEquals(result, "TxNoRollbackTag", "rollback disabled: return value");

  const tagSnapshot = getSheetSnapshot("Tag");
  tagSnapshot.assertCount(31);
  tagSnapshot.assertRowExists({ name: "TxNoRollbackTag" });

  assertNoBackupResidue("rollback disabled");

  resetSheet("Tag", tagData);

  Logger.log("✅ testTransactionRollbackDisabled: all passed");
}

export { testTransactionRollbackDisabled };
