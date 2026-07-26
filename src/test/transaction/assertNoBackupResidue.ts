import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";

const BACKUP_SHEET_PREFIX = "_gassma_tx_";
const MARKER_KEY_PREFIX = "gassma_tx_backup_";

// commit 完了後にバックアップシート・ScriptProperties マーカーが残っていないこと
function assertNoBackupResidue(label: string) {
  const leftoverSheets = SpreadsheetApp.openById(SPREADSHEET_ID_DB1)
    .getSheets()
    .map((sheet) => sheet.getName())
    .filter((name) => name.startsWith(BACKUP_SHEET_PREFIX));
  if (leftoverSheets.length > 0) {
    throw new Error(
      `${label}: backup sheets left behind: ${leftoverSheets.join(", ")}`,
    );
  }

  const leftoverKeys = PropertiesService.getScriptProperties()
    .getKeys()
    .filter((key) => key.startsWith(MARKER_KEY_PREFIX));
  if (leftoverKeys.length > 0) {
    throw new Error(
      `${label}: backup markers left behind: ${leftoverKeys.join(", ")}`,
    );
  }
}

export { assertNoBackupResidue };
