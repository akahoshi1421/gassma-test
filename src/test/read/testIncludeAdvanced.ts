import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

function testIncludeAdvanced() {
  const client = new GassmaClient();

  testIncludeSelect(client);
  testIncludeOmit(client);
  testIncludeOrderBy(client);
  testIncludeOrderByArray(client);
  testSelectRelationOrderByArray(client);
  testIncludeSkipTake(client);
  testIncludeCountWithWhere(client);
  testIncludeCountTrueAllRelations(client);

  Logger.log("✅ testIncludeAdvanced: all passed");
}

function testIncludeSelect(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        select: { id: true, title: true },
      },
    },
  });
  if (!user) throw new Error("include select: user null");
  if (user.posts.length === 0) throw new Error("include select: no posts");

  const postKeys = Object.keys(user.posts[0]);
  if (postKeys.indexOf("id") === -1)
    throw new Error("include select: id should be present");
  if (postKeys.indexOf("title") === -1)
    throw new Error("include select: title should be present");
  if (postKeys.indexOf("content") !== -1)
    throw new Error("include select: content should be excluded");
  if (postKeys.indexOf("authorId") !== -1)
    throw new Error("include select: authorId should be excluded");
}

function testIncludeOmit(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        omit: { content: true, rating: true },
      },
    },
  });
  if (!user) throw new Error("include omit: user null");
  if (user.posts.length === 0) throw new Error("include omit: no posts");

  const postKeys = Object.keys(user.posts[0]);
  if (postKeys.indexOf("title") === -1)
    throw new Error("include omit: title should be present");
  if (postKeys.indexOf("content") !== -1)
    throw new Error("include omit: content should be excluded");
  if (postKeys.indexOf("rating") !== -1)
    throw new Error("include omit: rating should be excluded");
}

function testIncludeOrderBy(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        orderBy: { id: "desc" },
      },
    },
  });
  if (!user) throw new Error("include orderBy: user null");
  if (user.posts.length < 2)
    throw new Error("include orderBy: need at least 2 posts");

  const firstId = user.posts[0].id;
  const secondId = user.posts[1].id;
  if (firstId === null || secondId === null)
    throw new Error("include orderBy: id is null");
  if (firstId <= secondId)
    throw new Error(`include orderBy desc: ${firstId} should be > ${secondId}`);
}

function testIncludeOrderByArray(client: GassmaClient) {
  // authorId 1 の posts の published は {54,138}=false / {56,94,115,157,182}=true。
  // 第1キー published asc の同値内で第2キー id desc がタイブレークとして効く
  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        orderBy: [{ published: "asc" }, { id: "desc" }],
        select: { id: true },
      },
    },
  });
  if (!user) throw new Error("include orderBy array: user null");

  const ids = user.posts.map((post) => post.id);
  assertDeepEquals(
    ids,
    [138, 54, 182, 157, 115, 94, 56],
    "include orderBy array ids",
  );
}

function testSelectRelationOrderByArray(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      posts: {
        orderBy: [{ published: "asc" }, { id: "desc" }],
        select: { id: true },
      },
    },
  });
  if (!user) throw new Error("select relation orderBy array: user null");

  const ids = user.posts.map((post) => post.id);
  assertDeepEquals(
    ids,
    [138, 54, 182, 157, 115, 94, 56],
    "select relation orderBy array ids",
  );
}

function testIncludeSkipTake(client: GassmaClient) {
  const userAll = client.User.findFirst({
    where: { id: 1 },
    include: { posts: true },
  });
  if (!userAll) throw new Error("include skipTake: user null");
  void userAll.posts;

  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        take: 2,
        skip: 1,
        orderBy: { id: "asc" },
      },
    },
  });
  if (!user) throw new Error("include skipTake: user null");
  assertEquals(user.posts.length, 2, "include skipTake count");
}

function testIncludeCountWithWhere(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      _count: {
        select: {
          posts: { where: { published: true } },
        },
      },
    },
  });
  if (!user) throw new Error("include count where: user null");
  if (typeof user._count.posts !== "number")
    throw new Error("include count where: posts not number");

  const userAll = client.User.findFirst({
    where: { id: 1 },
    include: { _count: { select: { posts: true } } },
  });
  if (!userAll) throw new Error("include count where: userAll null");
  const allCount = userAll._count.posts;
  if (user._count.posts > allCount)
    throw new Error(
      `include count where: filtered ${user._count.posts} > all ${allCount}`,
    );
}

function testIncludeCountTrueAllRelations(client: GassmaClient) {
  // _count: true で User の全リレーション (posts/comments/orders/profile) が数えられる
  const user = client.User.findFirst({
    where: { id: 1 },
    include: { _count: true },
  });
  if (!user) throw new Error("include _count true: user null");

  const countKeys = Object.keys(user._count);
  assertEquals(countKeys.length, 4, "include _count true: relation key count");
  ["posts", "comments", "orders", "profile"].forEach((key) => {
    if (countKeys.indexOf(key) === -1) {
      throw new Error(`include _count true: missing key ${key}`);
    }
  });

  // consts 実データ: authorId=1 の Post 7 件 / Comment 7 件 / userId=1 の Order 9 件 / Profile 1 件
  assertEquals(user._count.posts, 7, "include _count true: posts");
  assertEquals(user._count.comments, 7, "include _count true: comments");
  assertEquals(user._count.orders, 9, "include _count true: orders");
  assertEquals(user._count.profile, 1, "include _count true: profile");
}

export { testIncludeAdvanced };
