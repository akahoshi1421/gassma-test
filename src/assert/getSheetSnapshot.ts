import { SheetSnapshot } from "./SheetSnapshot";

function getSheetSnapshot(sheetName: string): SheetSnapshot {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow === 0 || lastCol === 0) {
    return new SheetSnapshot(sheetName, [], []);
  }

  const rawData = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = rawData[0].map(String);
  const rows = rawData.slice(1);

  return new SheetSnapshot(sheetName, headers, rows);
}

export { getSheetSnapshot };
