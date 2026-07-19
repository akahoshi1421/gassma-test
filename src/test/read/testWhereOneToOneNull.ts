import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { assertThrows } from "../../assert/assertThrows";
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
  testProfileNullShorthand(client);
  testCategoryNullShorthand(client);
  testNotProfileNullShorthand(client);
  testPostsNullShorthandThrows(client);
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

function testProfileNullShorthand(client: GassmaClient) {
  const users = client.User.findMany({
    where: { profile: null },
  });
  assertDeepEquals(users.map((user) => user.id), [998], "oneToOne null shorthand: ids");
}

function testCategoryNullShorthand(client: GassmaClient) {
  const shorthand = client.Post.findMany({
    where: { category: null },
  });
  const explicit = client.Post.findMany({
    where: { category: { is: null } },
  });
  assertEquals(shorthand.length, 22, "manyToOne null shorthand: length");
  assertDeepEquals(
    shorthand.map((post) => post.id),
    explicit.map((post) => post.id),
    "manyToOne null shorthand: same ids as is null",
  );
}

function testNotProfileNullShorthand(client: GassmaClient) {
  const users = client.User.findMany({
    where: { NOT: { profile: null } },
  });
  assertEquals(users.length, 50, "NOT null shorthand: length");
  const ids = users.map((user) => user.id);
  if (ids.indexOf(998) !== -1) {
    throw new Error("NOT null shorthand: id 998 should not match");
  }
}

function testPostsNullShorthandThrows(client: GassmaClient) {
  assertThrows(
    () =>
      client.User.findMany({
        where: {
          // @ts-expect-error list relation への直値 null は型レベルで禁止
          posts: null,
        },
      }),
    'Filter "null" cannot be used on relation "posts"',
    "list null shorthand: throws",
  );
}

export { testWhereOneToOneNull };
