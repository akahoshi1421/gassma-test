import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

function testDistinctOrderByMulti() {
  const client = new GassmaClient();

  testDistinctMultipleKeys(client);
  testOrderByArrayMultipleKeys(client);
  testOrderByObjectFirstKeyOnly(client);

  Logger.log("✅ testDistinctOrderByMulti: all passed");
}

function testDistinctMultipleKeys(client: GassmaClient) {
  // consts postData: (authorId, categoryId) の組は 180 通り / authorId 単独 50 / categoryId 単独 21 (null 含む)
  assertEquals(
    client.Post.findMany({ distinct: ["authorId", "categoryId"] }).length,
    180,
    "distinct multi keys",
  );
  assertEquals(client.Post.findMany({ distinct: ["authorId"] }).length, 50, "distinct authorId");
  assertEquals(client.Post.findMany({ distinct: ["categoryId"] }).length, 21, "distinct categoryId");
}

function testOrderByArrayMultipleKeys(client: GassmaClient) {
  // role asc → id desc: ADMIN (id 1,4,18,34,35,45) が id 降順、7 件目は MODERATOR 最大 id 49
  const users = client.User.findMany({
    orderBy: [{ role: "asc" }, { id: "desc" }],
    take: 7,
  });
  assertDeepEquals(
    users.map((user) => user.id),
    [45, 35, 34, 18, 4, 1, 49],
    "orderBy array: ids",
  );
  users.slice(0, 6).forEach((user) => {
    assertEquals(user.role, "ADMIN", "orderBy array: first 6 role");
  });
  assertEquals(users[6].role, "MODERATOR", "orderBy array: 7th role");
}

function testOrderByObjectFirstKeyOnly(client: GassmaClient) {
  // GASsma 固有仕様: 1 オブジェクト複数キーは先頭キーのみ有効 (id: "desc" は無視されシート順のまま)
  const users = client.User.findMany({
    orderBy: { role: "asc", id: "desc" },
    take: 6,
  });
  assertDeepEquals(
    users.map((user) => user.id),
    [1, 4, 18, 34, 35, 45],
    "orderBy object: first key only",
  );
  users.forEach((user) => {
    assertEquals(user.role, "ADMIN", "orderBy object: role");
  });
}

export { testDistinctOrderByMulti };
