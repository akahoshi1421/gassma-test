import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertThrows } from "../../assert/assertThrows";

function testFindFirstTakeSkipDistinct() {
  const client = new GassmaClient();

  testTakeMinusOneWithOrderBy(client);
  testTakeMinusOneSheetOrder(client);
  testTakeLimitedToOneOrMinusOne(client);
  testSkipBasic(client);
  testSkipExceedsCount(client);
  testSkipNegative(client);
  testDistinctBeforeSkip(client);
  testCursorThenSkip(client);
  testTakeMinusOneThenCursor(client);
  testRelationOrderByTakeMinusOne(client);

  Logger.log("✅ testFindFirstTakeSkipDistinct: all passed");
}

function testTakeMinusOneWithOrderBy(client: GassmaClient) {
  // take: -1 は並びを反転して先頭 = orderBy 逆側の行
  const desc = client.User.findFirst({ orderBy: { id: "desc" }, take: -1 });
  if (desc === null) throw new Error("take -1 orderBy desc: got null");
  assertEquals(desc.id, 1, "take -1 orderBy desc id");
  assertEquals(desc.name, "Chris Jackson", "take -1 orderBy desc name");

  const asc = client.User.findFirst({ orderBy: { id: "asc" }, take: -1 });
  if (asc === null) throw new Error("take -1 orderBy asc: got null");
  assertEquals(asc.id, 50, "take -1 orderBy asc id");
}

function testTakeMinusOneSheetOrder(client: GassmaClient) {
  // orderBy 無しの take: -1 はシート逆順の先頭 = 最終行
  const user = client.User.findFirst({ take: -1 });
  if (user === null) throw new Error("take -1 sheet order: got null");
  assertEquals(user.id, 50, "take -1 sheet order id");
  assertEquals(user.name, "加藤 拓也", "take -1 sheet order name");
}

function testTakeLimitedToOneOrMinusOne(client: GassmaClient) {
  const user = client.User.findFirst({ take: 1 });
  if (user === null) throw new Error("take 1: got null");
  assertEquals(user.id, 1, "take 1 id");

  assertThrows(
    () => {
      client.User.findFirst({ take: 2 });
    },
    "The 'findFirst' operation cannot be used with a 'take' argument",
    "findFirst take 2",
  );

  // findMany の take: 0 は空配列だが findFirst はエラー
  assertThrows(
    () => {
      client.User.findFirst({ take: 0 });
    },
    "The 'findFirst' operation cannot be used with a 'take' argument",
    "findFirst take 0",
  );
}

function testSkipBasic(client: GassmaClient) {
  // ADMIN はシート順 1, 4, 18, 34, 35, 45
  const user = client.User.findFirst({ where: { role: "ADMIN" }, skip: 2 });
  if (user === null) throw new Error("skip basic: got null");
  assertEquals(user.id, 18, "skip 2 id");
  assertEquals(user.name, "中村 浩二", "skip 2 name");
}

function testSkipExceedsCount(client: GassmaClient) {
  const user = client.User.findFirst({ where: { role: "ADMIN" }, skip: 6 });
  assertEquals(user, null, "skip exceeds count");
}

function testSkipNegative(client: GassmaClient) {
  assertThrows(
    () => {
      client.User.findFirst({ skip: -1 });
    },
    "Invalid value for skip argument",
    "findFirst skip negative",
  );
}

function testDistinctBeforeSkip(client: GassmaClient) {
  // role の初出は id 1(ADMIN), 2(USER), 6(MODERATOR)。distinct → skip の順なので skip: 2 は id 6。
  // skip → distinct の順なら id 3 になる
  const user = client.User.findFirst({
    orderBy: { id: "asc" },
    distinct: ["role"],
    skip: 2,
  });
  if (user === null) throw new Error("distinct before skip: got null");
  assertEquals(user.id, 6, "distinct skip 2 id");
  assertEquals(user.role, "MODERATOR", "distinct skip 2 role");
}

function testCursorThenSkip(client: GassmaClient) {
  // cursor は inclusive に位置決め → その後 skip。skip → cursor の順なら id 10 のまま
  const user = client.User.findFirst({ cursor: { id: 10 }, skip: 2 });
  if (user === null) throw new Error("cursor then skip: got null");
  assertEquals(user.id, 12, "cursor 10 skip 2 id");
  assertEquals(user.name, "伊藤 誠", "cursor 10 skip 2 name");
}

function testTakeMinusOneThenCursor(client: GassmaClient) {
  // cursor は take: -1 の反転後の並びで探す。John Smith は id 21 と 47 で、
  // 反転前の先頭一致は 21(testCursor で固定済み)、反転後は 47
  const user = client.User.findFirst({
    take: -1,
    cursor: { name: "John Smith" },
  });
  if (user === null) throw new Error("take -1 then cursor: got null");
  assertEquals(user.id, 47, "take -1 cursor id");
}

function testRelationOrderByTakeMinusOne(client: GassmaClient) {
  // relation orderBy 経路でも take: -1 が効く。author.name 最大は 高橋 麻衣(id 16) で、
  // その投稿はシート順 12, 13, 26, 76, 112, 175 → 反転先頭は 175
  const post = client.Post.findFirst({
    orderBy: { author: { name: "asc" } },
    take: -1,
  });
  if (post === null) throw new Error("relation orderBy take -1: got null");
  assertEquals(post.id, 175, "relation orderBy take -1 id");
  assertEquals(post.authorId, 16, "relation orderBy take -1 authorId");
}

export { testFindFirstTakeSkipDistinct };
