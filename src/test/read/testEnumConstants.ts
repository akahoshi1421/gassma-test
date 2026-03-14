import { GassmaClient, Role } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";

function testEnumConstants() {
  testEnumConstantValues();
  testEnumConstantInWhere();
  testEnumConstantInCreate();
  testEnumConstantType();

  Logger.log("✅ testEnumConstants: all passed");
}

function testEnumConstantValues() {
  // enum 定数が @map の値を持つ
  assertEquals(Role.admin, "ADMIN", "enum constant: Role.admin");
  assertEquals(Role.user, "USER", "enum constant: Role.user");
  assertEquals(Role.moderator, "MODERATOR", "enum constant: Role.moderator");
}

function testEnumConstantInWhere() {
  // enum 定数を where 条件で使用できる
  const client = new GassmaClient();

  const admins = client.sheets.User.findMany({
    where: { role: Role.admin },
  });

  admins.forEach((u) => {
    assertEquals(u.role, "ADMIN", "enum where: role should be ADMIN");
  });

  if (admins.length === 0) {
    throw new Error("enum where: expected at least one admin user");
  }
}

function testEnumConstantInCreate() {
  // enum 定数を create で使用できる
  const client = new GassmaClient();

  const result = client.sheets.User.create({
    data: {
      id: 9999,
      email: "enum-test@example.com",
      name: "Enum Test User",
      role: Role.moderator,
      isActive: true,
      createdAt: new Date(),
    },
  });

  assertEquals(result.role, "MODERATOR", "enum create: role should be MODERATOR");

  // クリーンアップ
  client.sheets.User.deleteMany({ where: { id: 9999 } });
}

function testEnumConstantType() {
  // enum 定数と文字列リテラルが同じ値
  const fromConstant: string = Role.admin;
  const fromLiteral: string = "ADMIN";

  assertEquals(fromConstant, fromLiteral, "enum type: constant equals literal");
}

export { testEnumConstants };
