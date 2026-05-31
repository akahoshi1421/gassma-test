import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testIncludeAdvanced() {
  const client = new GassmaClient();

  testIncludeSelect(client);
  testIncludeOmit(client);
  testIncludeOrderBy(client);
  testIncludeSkipTake(client);
  testIncludeCountWithWhere(client);

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

export { testIncludeAdvanced };
