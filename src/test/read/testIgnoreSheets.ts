import { GassmaClient } from "../../generated/gassma/gassmaClient";

function testIgnoreSheets() {
  testIgnoreSheetsNotAccessible();
  testIgnoreSheetsOtherModelsWork();

  Logger.log("✅ testIgnoreSheets: all passed");
}

function testIgnoreSheetsNotAccessible() {
  // @@ignore されたモデル (AuditLog) はクライアントに存在しない
  const client = new GassmaClient();
  const clientRecord = client as unknown as Record<string, unknown>;

  if (clientRecord["AuditLog"] !== undefined) {
    throw new Error("ignoreSheets: AuditLog should not be accessible via client");
  }
}

function testIgnoreSheetsOtherModelsWork() {
  // @@ignore 以外のモデルは通常通りアクセスできる
  const client = new GassmaClient();

  const user = client.User.findFirst({ where: { id: 1 } });
  if (!user) throw new Error("ignoreSheets: User should still be accessible");
  if (user.id !== 1) throw new Error("ignoreSheets: User.id should be 1");
}

export { testIgnoreSheets };
