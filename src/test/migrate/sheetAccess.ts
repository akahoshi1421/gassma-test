type Sheet = GoogleAppsScript.Spreadsheet.Sheet;

// ライブラリ側は別インスタンスの Spreadsheet を開いて書き込むため、
// 検証は毎回 openById で開き直して最新状態を読む(getSheetSnapshot と同じ流儀)。
function getSheet(spreadsheetId: string, sheetName: string): Sheet {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
  return sheet;
}

function getSheetNames(spreadsheetId: string): string[] {
  return SpreadsheetApp.openById(spreadsheetId)
    .getSheets()
    .map((sheet) => sheet.getName());
}

function getHeaderRow(sheet: Sheet, width: number): string[] {
  if (width < 1) return [];
  return sheet
    .getRange(1, 1, 1, width)
    .getValues()[0]
    .map((title) => String(title));
}

function createSheetWith(
  spreadsheetId: string,
  sheetName: string,
  headers: string[],
  rows: unknown[][],
): Sheet {
  const sheet = SpreadsheetApp.openById(spreadsheetId).insertSheet(sheetName);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
  // ライブラリは別インスタンスでこのシートを読むので、下準備の書き込みを確定させておく
  SpreadsheetApp.flush();
  return sheet;
}

export { getSheet, getSheetNames, getHeaderRow, createSheetWith };
