import { SPREADSHEET_ID_DB1 } from "../consts/spreadsheetIds";

function resetSheet(sheetName: string, data: unknown[][], spreadsheetId: string = SPREADSHEET_ID_DB1) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

  sheet.clearContents();
  if (data.length === 0) return;

  const rows = data.length;
  const cols = data[0].length;
  sheet.getRange(1, 1, rows, cols).setValues(data);
}

export { resetSheet };
