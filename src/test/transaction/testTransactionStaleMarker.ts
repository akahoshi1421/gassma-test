import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { assertNoBackupResidue } from "./assertNoBackupResidue";

const MARKER_KEY = `gassma_tx_backup_${SPREADSHEET_ID_DB1}`;

function testTransactionStaleMarker() {
  const client = new GassmaClient();
  const props = PropertiesService.getScriptProperties();
  const original = props.getProperty(MARKER_KEY);

  // 実在しない backup 名の stale マーカーがあっても、警告(実行ログ目視)だけで tx は完走する
  props.setProperty(MARKER_KEY, JSON.stringify(["_gassma_tx_0_StaleGhost"]));

  try {
    const result = client.$transaction((tx) => {
      const tag = tx.Tag.create({ data: { name: "TxStaleMarkerTag" } });
      return tag.name;
    });

    assertEquals(result, "TxStaleMarkerTag", "stale marker: return value");

    const tagSnapshot = getSheetSnapshot("Tag");
    tagSnapshot.assertRowExists({ name: "TxStaleMarkerTag" });

    // stale マーカーは新 tx が上書きし、commit 完了の掃除で消えている
    assertEquals(
      props.getProperty(MARKER_KEY),
      null,
      "stale marker: marker cleared by the new transaction",
    );

    assertNoBackupResidue("stale marker");
  } finally {
    if (original !== null) {
      props.setProperty(MARKER_KEY, original);
    } else {
      props.deleteProperty(MARKER_KEY);
    }
    resetSheet("Tag", tagData);
  }

  Logger.log("✅ testTransactionStaleMarker: all passed");
}

export { testTransactionStaleMarker };
