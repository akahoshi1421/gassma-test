type Sheet = GoogleAppsScript.Spreadsheet.Sheet;

type SheetFingerprint = {
  name: string;
  maxColumns: number;
  values: unknown[][];
};

function fingerprintSheet(sheet: Sheet): SheetFingerprint {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  const values =
    lastRow === 0 || lastColumn === 0
      ? []
      : sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  return { name: sheet.getName(), maxColumns: sheet.getMaxColumns(), values };
}

function fingerprintSpreadsheet(spreadsheetId: string): SheetFingerprint[] {
  return SpreadsheetApp.openById(spreadsheetId)
    .getSheets()
    .map((sheet) => fingerprintSheet(sheet));
}

export { fingerprintSheet, fingerprintSpreadsheet };
export type { SheetFingerprint };
