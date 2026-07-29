type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

// migrateSheets はシート/列を生やす API なので、本番フィクスチャ(DB1)ではなく
// 使い捨てスプレッドシートで検証する。アサーション失敗時もゴミを残さないよう finally で捨てる。
function withTemporarySpreadsheet<T>(
  label: string,
  fn: (spreadsheetId: string) => T,
): T {
  const spreadsheet: Spreadsheet = SpreadsheetApp.create(
    `gassma-test-${label}-${Date.now()}`,
  );
  const spreadsheetId = spreadsheet.getId();
  try {
    return fn(spreadsheetId);
  } finally {
    DriveApp.getFileById(spreadsheetId).setTrashed(true);
  }
}

export { withTemporarySpreadsheet };
