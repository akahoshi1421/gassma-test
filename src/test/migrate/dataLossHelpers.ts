import { getHeaderRow } from "./sheetAccess";

// acceptDataLoss: true は models に無いシートをすべて落とす。
// 使い捨てスプレッドシートは既存ケースと共有しているため、削除対象以外の
// 全シートを「現ヘッダーどおりの no-op モデル」として models に含めて守る。
function listPreserveModels(
  spreadsheetId: string,
  excludeNames: string[],
): Gassma.MigrateModel[] {
  return SpreadsheetApp.openById(spreadsheetId)
    .getSheets()
    .filter((sheet) => excludeNames.indexOf(sheet.getName()) === -1)
    .map((sheet) => ({
      name: sheet.getName(),
      columns: getHeaderRow(sheet, sheet.getLastColumn()),
    }));
}

// targetModels: 列を同期するシート / dropSheetNames: シートごと落とすシート
function migrateWithDataLoss(
  spreadsheetId: string,
  targetModels: Gassma.MigrateModel[],
  dropSheetNames: string[],
) {
  const excludeNames = targetModels
    .map((model) => model.name)
    .concat(dropSheetNames);
  const models = listPreserveModels(spreadsheetId, excludeNames).concat(
    targetModels,
  );
  Gassma.migrateSheets({ spreadsheetId, models, acceptDataLoss: true });
}

export { listPreserveModels, migrateWithDataLoss };
