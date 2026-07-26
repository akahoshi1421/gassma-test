import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";

const BACKUP_SHEET_PREFIX = "_gassma_tx_";

// commit 完了後にバックアップシートが残っていないこと。
// ScriptProperties のマーカーはライブラリ側ストア(Shared** — ライブラリ自身のインスタンス)に
// 保存されるため、ホスト側の本プロジェクトからは観測できない
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
}

export { assertNoBackupResidue };
