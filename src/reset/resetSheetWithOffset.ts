import { SPREADSHEET_ID_DB1 } from "../consts/spreadsheetIds";

function resetSheetWithOffset(
  sheetName: string,
  data: unknown[][],
  startRow: number,
  startColumn: number,
  spreadsheetId: string = SPREADSHEET_ID_DB1,
) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

  sheet.clearContents();
  if (data.length === 0) return;

  const rows = data.length;
  const cols = data[0].length;
  sheet.getRange(startRow, startColumn, rows, cols).setValues(data);
}

export { resetSheetWithOffset };
