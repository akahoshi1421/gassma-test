import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testOrderByAdvanced() {
  const client = new GassmaClient();

  testNullsFirst(client);
  testNullsLast(client);
  testRelationOrderBy(client);
  testCountOrderBy(client);

  Logger.log("✅ testOrderByAdvanced: all passed");
}

function testNullsFirst(client: GassmaClient) {
  const users = client.User.findMany({
    orderBy: { age: { sort: "asc", nulls: "first" } },
  });
  // null の age が先頭にくるはず
  if (users.length === 0) throw new Error("nulls first: no results");

  // 最初の数件が null であることを確認
  let foundNull = false;
  let foundNonNull = false;
  users.forEach((user) => {
    if (user.age === null || user.age === undefined) {
      if (foundNonNull) {
        throw new Error("nulls first: null appeared after non-null");
      }
      foundNull = true;
    } else {
      foundNonNull = true;
    }
  });
  if (!foundNull) {
    throw new Error("nulls first: expected null values");
  }
}

function testNullsLast(client: GassmaClient) {
  const users = client.User.findMany({
    orderBy: { age: { sort: "asc", nulls: "last" } },
  });
  if (users.length === 0) throw new Error("nulls last: no results");

  // null が末尾にくるはず
  let foundNull = false;
  users.forEach((user) => {
    if (user.age === null || user.age === undefined) {
      foundNull = true;
    } else {
      if (foundNull) {
        throw new Error("nulls last: non-null appeared after null");
      }
    }
  });
  if (!foundNull) {
    throw new Error("nulls last: expected null values");
  }
}

function testRelationOrderBy(client: GassmaClient) {
  // Post を author の name でソート（manyToOne リレーションソート）
  const posts = client.Post.findMany({
    orderBy: { author: { name: "asc" } },
    take: 10,
  });
  if (posts.length === 0) throw new Error("relation orderBy: no results");
  assertEquals(posts.length, 10, "relation orderBy count");
}

function testCountOrderBy(client: GassmaClient) {
  // User を posts の _count でソート
  const users = client.User.findMany({
    orderBy: { posts: { _count: "desc" } },
    take: 5,
  });
  if (users.length === 0) throw new Error("count orderBy: no results");
  assertEquals(users.length, 5, "count orderBy count");
}

export { testOrderByAdvanced };
