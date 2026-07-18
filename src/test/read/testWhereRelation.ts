import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testWhereRelation() {
  const client = new GassmaClient();

  testWhereSome(client);
  testWhereEvery(client);
  testWhereNone(client);
  testWhereIs(client);
  testWhereIsNot(client);
  testWhereRelationCount(client);
  testWhereRelationAggregate(client);
  testWhereIsNull(client);
  testWhereIsNotNull(client);

  Logger.log("✅ testWhereRelation: all passed");
}

function testWhereSome(client: GassmaClient) {
  const users = client.User.findMany({
    where: {
      posts: {
        some: { published: true },
      },
    },
  });
  if (users.length === 0) {
    throw new Error("where some: expected users with published posts");
  }
}

function testWhereEvery(client: GassmaClient) {
  const users = client.User.findMany({
    where: {
      posts: {
        every: { published: true },
      },
    },
  });
  // every は全ての投稿が published の場合のみマッチ
  // 投稿がないユーザーも含まれる
  if (!Array.isArray(users)) {
    throw new Error("where every: expected array");
  }
}

function testWhereNone(client: GassmaClient) {
  const users = client.User.findMany({
    where: {
      posts: {
        none: { published: true },
      },
    },
  });
  if (!Array.isArray(users)) {
    throw new Error("where none: expected array");
  }
}

function testWhereIs(client: GassmaClient) {
  const posts = client.Post.findMany({
    where: {
      author: {
        is: { role: "ADMIN" },
      },
    },
  });
  if (posts.length === 0) {
    throw new Error("where is: expected posts by admin");
  }
}

function testWhereIsNot(client: GassmaClient) {
  const posts = client.Post.findMany({
    where: {
      author: {
        isNot: { role: "ADMIN" },
      },
    },
  });
  if (posts.length === 0) {
    throw new Error("where isNot: expected posts by non-admin");
  }
}

function testWhereRelationCount(client: GassmaClient) {
  // 未公開 Post を1件以上持つ User は 43 人（consts postData の authorId 重複排除）
  const count = client.User.count({
    where: {
      posts: {
        some: { published: false },
      },
    },
  });
  assertEquals(count, 43, "count with relation filter");
}

function testWhereRelationAggregate(client: GassmaClient) {
  // ADMIN (id: 1,4,18,34,35,45) の Post は 27 件、viewCount 合計 142738
  const result = client.Post.aggregate({
    where: {
      author: {
        is: { role: "ADMIN" },
      },
    },
    _count: { id: true },
    _sum: { viewCount: true },
  });
  assertEquals(result._count.id, 27, "aggregate with relation filter: count");
  assertEquals(result._sum.viewCount, 142738, "aggregate with relation filter: sum");
}

function testWhereIsNull(client: GassmaClient) {
  // categoryId が null の Post は 22 件 (id 9,18,...,198 の 9 の倍数)
  const count = client.Post.count({
    where: { category: { is: null } },
  });
  assertEquals(count, 22, "is null: count");

  const posts = client.Post.findMany({
    where: { category: { is: null } },
  });
  assertEquals(posts.length, 22, "is null: findMany length");
  posts.forEach((post) => {
    if (post.categoryId !== null) {
      throw new Error(`is null: post ${post.id} has categoryId ${post.categoryId}`);
    }
  });
  const ids = posts.map((post) => post.id);
  if (ids.indexOf(9) === -1 || ids.indexOf(198) === -1) {
    throw new Error(`is null: expected ids 9 and 198 in ${JSON.stringify(ids)}`);
  }
}

function testWhereIsNotNull(client: GassmaClient) {
  const count = client.Post.count({
    where: { category: { isNot: null } },
  });
  assertEquals(count, 178, "isNot null: count");

  const posts = client.Post.findMany({
    where: { category: { isNot: null } },
  });
  assertEquals(posts.length, 178, "isNot null: findMany length");
  posts.forEach((post) => {
    if (post.categoryId === null) {
      throw new Error(`isNot null: post ${post.id} has null categoryId`);
    }
  });

  // is null (22) + isNot null (178) で全 200 件を分割できる
  assertEquals(count + 22, 200, "is null + isNot null partition");
}

export { testWhereRelation };
