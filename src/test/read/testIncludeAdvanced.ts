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
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        select: { id: true, title: true },
      },
    },
  });
  if (!user) throw new Error("include select: user null");
  const posts = (user as Record<string, unknown>).posts as Record<string, unknown>[];
  if (posts.length === 0) throw new Error("include select: no posts");

  const postKeys = Object.keys(posts[0]);
  if (postKeys.indexOf("id") === -1) {
    throw new Error("include select: id should be present");
  }
  if (postKeys.indexOf("title") === -1) {
    throw new Error("include select: title should be present");
  }
  if (postKeys.indexOf("content") !== -1) {
    throw new Error("include select: content should be excluded");
  }
  if (postKeys.indexOf("authorId") !== -1) {
    throw new Error("include select: authorId should be excluded");
  }
}

function testIncludeOmit(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        omit: { content: true, rating: true },
      },
    },
  });
  if (!user) throw new Error("include omit: user null");
  const posts = (user as Record<string, unknown>).posts as Record<string, unknown>[];
  if (posts.length === 0) throw new Error("include omit: no posts");

  const postKeys = Object.keys(posts[0]);
  if (postKeys.indexOf("title") === -1) {
    throw new Error("include omit: title should be present");
  }
  if (postKeys.indexOf("content") !== -1) {
    throw new Error("include omit: content should be excluded");
  }
  if (postKeys.indexOf("rating") !== -1) {
    throw new Error("include omit: rating should be excluded");
  }
}

function testIncludeOrderBy(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        orderBy: { id: "desc" },
      },
    },
  });
  if (!user) throw new Error("include orderBy: user null");
  const posts = (user as Record<string, unknown>).posts as Record<string, unknown>[];
  if (posts.length < 2) throw new Error("include orderBy: need at least 2 posts");

  // desc なので最初の id > 次の id
  const firstId = posts[0].id as number;
  const secondId = posts[1].id as number;
  if (firstId <= secondId) {
    throw new Error(`include orderBy desc: ${firstId} should be > ${secondId}`);
  }
}

function testIncludeSkipTake(client: GassmaClient) {
  // まず全件取得して件数を確認
  const userAll = client.sheets.User.findFirst({
    where: { id: 1 },
    include: { posts: true },
  });
  if (!userAll) throw new Error("include skipTake: user null");
  const allPosts = (userAll as Record<string, unknown>).posts as Record<string, unknown>[];

  // skip/take で制限
  const user = client.sheets.User.findFirst({
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
  const posts = (user as Record<string, unknown>).posts as Record<string, unknown>[];
  assertEquals(posts.length, 2, "include skipTake count");
}

function testIncludeCountWithWhere(client: GassmaClient) {
  // _count で条件付きカウント
  const user = client.sheets.User.findFirst({
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
  if (!("_count" in user)) throw new Error("include count where: _count missing");
  const count = (user as Record<string, unknown>)._count as Record<string, number>;
  if (typeof count.posts !== "number") {
    throw new Error("include count where: posts not number");
  }

  // 全件カウントと比較して条件付きが <= であること
  const userAll = client.sheets.User.findFirst({
    where: { id: 1 },
    include: { _count: { select: { posts: true } } },
  });
  const allCount = ((userAll as Record<string, unknown>)._count as Record<string, number>).posts;
  if (count.posts > allCount) {
    throw new Error(`include count where: filtered ${count.posts} > all ${allCount}`);
  }
}

export { testIncludeAdvanced };
