import { SheetSnapshot } from "./SheetSnapshot";
import { SPREADSHEET_ID_DB1 } from "../consts/spreadsheetIds";

function getSheetSnapshotWithOffset(
  sheetName: string,
  startRow: number,
  startColumn: number,
  spreadsheetId: string = SPREADSHEET_ID_DB1,
): SheetSnapshot {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < startRow || lastCol < startColumn) {
    return new SheetSnapshot(sheetName, [], []);
  }

  const rawData = sheet
    .getRange(startRow, startColumn, lastRow - startRow + 1, lastCol - startColumn + 1)
    .getValues();
  const headers = rawData[0].map(String);
  const rows = rawData.slice(1);

  return new SheetSnapshot(sheetName, headers, rows);
}

export { getSheetSnapshotWithOffset };
