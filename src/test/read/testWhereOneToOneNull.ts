import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";

function testWhereOneToOneNull() {
  const client = new GassmaClient();

  testProfileIsCondition(client);
  testProfileIsNotCondition(client);

  // consts の Profile.userId は 1〜50 を完全カバーするため、profile なし User を作成して検証
  client.User.create({
    data: {
      id: 998,
      email: "user998-noprofile@test.com",
      name: "NoProfile998",
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });
  testProfileIsNull(client);
  testProfileIsNotNull(client);
  resetSheet("User", userData);

  Logger.log("✅ testWhereOneToOneNull: all passed");
}

function testProfileIsNull(client: GassmaClient) {
  const users = client.User.findMany({
    where: { profile: { is: null } },
  });
  assertDeepEquals(users.map((user) => user.id), [998], "oneToOne is null: ids");
}

function testProfileIsNotNull(client: GassmaClient) {
  const users = client.User.findMany({
    where: { profile: { isNot: null } },
  });
  assertEquals(users.length, 50, "oneToOne isNot null: length");
  const ids = users.map((user) => user.id);
  if (ids.indexOf(998) !== -1) {
    throw new Error("oneToOne isNot null: id 998 should not match");
  }
}

function testProfileIsCondition(client: GassmaClient) {
  // consts で bio "セキュリティエンジニア" の Profile は userId 1, 3 の 2 件
  const users = client.User.findMany({
    where: { profile: { is: { bio: "セキュリティエンジニア" } } },
  });
  assertDeepEquals(users.map((user) => user.id), [1, 3], "oneToOne is condition: ids");
}

function testProfileIsNotCondition(client: GassmaClient) {
  const users = client.User.findMany({
    where: { profile: { isNot: { bio: "セキュリティエンジニア" } } },
  });
  assertEquals(users.length, 48, "oneToOne isNot condition: length");
  const ids = users.map((user) => user.id);
  if (ids.indexOf(1) !== -1 || ids.indexOf(3) !== -1) {
    throw new Error("oneToOne isNot condition: ids 1 and 3 should not match");
  }
}

export { testWhereOneToOneNull };
