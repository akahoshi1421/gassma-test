import { GassmaClient } from "../../generated/gassma/gassmaClient";

function testIgnoreSheets() {
  testIgnoreSheetsNotAccessible();
  testIgnoreSheetsOtherModelsWork();

  Logger.log("✅ testIgnoreSheets: all passed");
}

function testIgnoreSheetsNotAccessible() {
  // @@ignore されたモデル (AuditLog) は sheets に存在しない
  const client = new GassmaClient();
  const sheets = client.sheets as Record<string, unknown>;

  if (sheets["AuditLog"] !== undefined) {
    throw new Error("ignoreSheets: AuditLog should not be accessible via client.sheets");
  }
}

function testIgnoreSheetsOtherModelsWork() {
  // @@ignore 以外のモデルは通常通りアクセスできる
  const client = new GassmaClient();

  const user = client.sheets.User.findFirst({ where: { id: 1 } });
  if (!user) throw new Error("ignoreSheets: User should still be accessible");
  if (user.id !== 1) throw new Error("ignoreSheets: User.id should be 1");
}

export { testIgnoreSheets };
