import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

// findMany の distinct 適用位置 (Prisma パリティ):
// orderBy → (take 負数は反転順で) cursor → distinct → skip → take → 正順出力
function testDistinctPipeline() {
  const client = new GassmaClient();

  testDistinctAfterCursor(client);
  testDistinctAfterCursorWithTake(client);
  testDistinctReversedByTakeNegative(client);
  testDistinctTakeNegativeWithSkip(client);
  testDistinctTakeNegativeWithCursor(client);
  testRelationOrderByThenDistinct(client);
  testRelationOrderByDistinctTakeNegative(client);
  testDistinctAloneUnchanged(client);
  testDistinctSkipTakePositiveUnchanged(client);

  Logger.log("✅ testDistinctPipeline: all passed");
}

function testDistinctAfterCursor(client: GassmaClient) {
  // cursor 行 id 10 の role(USER) は id 2 で既出だが、cursor → distinct の順なので id 10 が残る
  const result = client.User.findMany({
    cursor: { id: 10 },
    distinct: ["role"],
  });
  assertDeepEquals(
    result.map((user) => user.id),
    [10, 16, 18],
    "distinct after cursor ids",
  );
  assertDeepEquals(
    result.map((user) => user.role),
    ["USER", "MODERATOR", "ADMIN"],
    "distinct after cursor roles",
  );
}

function testDistinctAfterCursorWithTake(client: GassmaClient) {
  const result = client.User.findMany({
    cursor: { id: 10 },
    distinct: ["role"],
    take: 2,
  });
  assertDeepEquals(
    result.map((user) => user.id),
    [10, 16],
    "distinct after cursor take ids",
  );
}

function testDistinctReversedByTakeNegative(client: GassmaClient) {
  // take 負数は反転順で distinct: 各 role の最終出現 50(USER), 49(MODERATOR), 45(ADMIN) が代表になり出力は正順
  const result = client.User.findMany({
    orderBy: { id: "asc" },
    distinct: ["role"],
    take: -3,
  });
  assertDeepEquals(
    result.map((user) => user.id),
    [45, 49, 50],
    "distinct take negative ids",
  );
  assertDeepEquals(
    result.map((user) => user.role),
    ["ADMIN", "MODERATOR", "USER"],
    "distinct take negative roles",
  );
}

function testDistinctTakeNegativeWithSkip(client: GassmaClient) {
  // 反転順 distinct [50, 49, 45] に skip: 1 → [49, 45] → 正順 [45, 49]
  const result = client.User.findMany({
    orderBy: { id: "asc" },
    distinct: ["role"],
    take: -2,
    skip: 1,
  });
  assertDeepEquals(
    result.map((user) => user.id),
    [45, 49],
    "distinct take negative skip ids",
  );
}

function testDistinctTakeNegativeWithCursor(client: GassmaClient) {
  // 反転順で cursor(id 10) から distinct: [10(USER), 6(MODERATOR), 4(ADMIN)] → take 2 → 正順 [6, 10]
  const result = client.User.findMany({
    cursor: { id: 10 },
    distinct: ["role"],
    take: -2,
  });
  assertDeepEquals(
    result.map((user) => user.id),
    [6, 10],
    "distinct take negative cursor ids",
  );
}

function testRelationOrderByThenDistinct(client: GassmaClient) {
  // author.name asc 先頭は Bob Davis(id 13) の投稿 41(true), 44, 99(false)。
  // ソート後に distinct するので published 両代表とも author 13 の投稿になる
  const result = client.Post.findMany({
    orderBy: { author: { name: "asc" } },
    distinct: ["published"],
  });
  assertDeepEquals(
    result.map((post) => post.id),
    [41, 99],
    "relation orderBy distinct ids",
  );
  assertDeepEquals(
    result.map((post) => post.published),
    [true, false],
    "relation orderBy distinct published",
  );
  result.forEach((post) => {
    assertEquals(post.authorId, 13, "relation orderBy distinct authorId");
  });
}

function testRelationOrderByDistinctTakeNegative(client: GassmaClient) {
  // author.name asc 末尾は 高橋 麻衣(id 16) の投稿 12, 13, 26, 76, 112, 175。
  // 反転順 distinct の代表は 175(true), 12(false) で出力は正順
  const result = client.Post.findMany({
    orderBy: { author: { name: "asc" } },
    distinct: ["published"],
    take: -2,
  });
  assertDeepEquals(
    result.map((post) => post.id),
    [12, 175],
    "relation orderBy distinct take negative ids",
  );
  assertDeepEquals(
    result.map((post) => post.published),
    [false, true],
    "relation orderBy distinct take negative published",
  );
}

function testDistinctAloneUnchanged(client: GassmaClient) {
  // 不変ピン: 単独 distinct は正順 first occurrence (id 1, 2, 6)
  const result = client.User.findMany({ distinct: ["role"] });
  assertDeepEquals(
    result.map((user) => user.id),
    [1, 2, 6],
    "distinct alone ids",
  );
}

function testDistinctSkipTakePositiveUnchanged(client: GassmaClient) {
  // 不変ピン: desc 順 distinct [50, 49, 45] → skip 1 → take 1
  const result = client.User.findMany({
    orderBy: { id: "desc" },
    distinct: ["role"],
    skip: 1,
    take: 1,
  });
  assertDeepEquals(
    result.map((user) => user.id),
    [49],
    "distinct skip take positive ids",
  );
}

export { testDistinctPipeline };
