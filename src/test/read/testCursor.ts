import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testCursor() {
  const client = new GassmaClient();

  testCursorBasic(client);
  testCursorWithTake(client);
  testFindFirstCursorHit(client);
  testFindFirstCursorAfterOrderBy(client);
  testFindFirstCursorMiss(client);
  testFindFirstCursorWithWhere(client);
  testFindFirstCursorRelationOrderBy(client);

  Logger.log("✅ testCursor: all passed");
}

function testCursorBasic(client: GassmaClient) {
  const result = client.User.findMany({
    cursor: { id: 10 },
    orderBy: { id: "asc" },
  });
  if (result.length === 0) throw new Error("cursor basic: expected results");
  assertEquals(result[0].id, 10, "cursor basic first id");
}

function testCursorWithTake(client: GassmaClient) {
  const result = client.User.findMany({
    cursor: { id: 10 },
    take: 5,
    orderBy: { id: "asc" },
  });
  assertEquals(result.length, 5, "cursor take count");
  assertEquals(result[0].id, 10, "cursor take first id");
  assertEquals(result[4].id, 14, "cursor take last id");
}

function testFindFirstCursorHit(client: GassmaClient) {
  // cursor 行自身が返る（inclusive）
  const result = client.User.findFirst({ cursor: { id: 10 } });
  if (!result) throw new Error("findFirst cursor hit: expected result");
  assertEquals(result.id, 10, "findFirst cursor hit id");
  assertEquals(result.name, "伊藤 結衣", "findFirst cursor hit name");
}

function testFindFirstCursorAfterOrderBy(client: GassmaClient) {
  // name "John Smith" は id 21 と 47 の2人。cursor は orderBy 適用後の並びで探す
  const sheetOrder = client.User.findFirst({
    cursor: { name: "John Smith" },
  });
  if (!sheetOrder) throw new Error("findFirst cursor sheet order: expected result");
  assertEquals(sheetOrder.id, 21, "findFirst cursor sheet order id");

  const descOrder = client.User.findFirst({
    orderBy: { id: "desc" },
    cursor: { name: "John Smith" },
  });
  if (!descOrder) throw new Error("findFirst cursor desc: expected result");
  assertEquals(descOrder.id, 47, "findFirst cursor desc id");
}

function testFindFirstCursorMiss(client: GassmaClient) {
  const result = client.User.findFirst({ cursor: { id: 985 } });
  assertEquals(result, null, "findFirst cursor miss");
}

function testFindFirstCursorWithWhere(client: GassmaClient) {
  // id 1 は isActive true なので where で除外され cursor が一致しない
  const result = client.User.findFirst({
    where: { isActive: false },
    cursor: { id: 1 },
  });
  assertEquals(result, null, "findFirst cursor filtered out");
}

function testFindFirstCursorRelationOrderBy(client: GassmaClient) {
  // relation orderBy 経路でも cursor が効く（authorId 47 の先頭は id 18）
  const result = client.Post.findFirst({
    orderBy: { author: { name: "asc" } },
    cursor: { authorId: 47 },
  });
  if (!result) throw new Error("findFirst cursor relation orderBy: expected result");
  assertEquals(result.id, 18, "findFirst cursor relation orderBy id");
}

export { testCursor };
