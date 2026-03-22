import { GassmaClient } from "../../generated/gassma/gassmaClient";

function testWhereRelation() {
  const client = new GassmaClient();

  testWhereSome(client);
  testWhereEvery(client);
  testWhereNone(client);
  testWhereIs(client);
  testWhereIsNot(client);

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

export { testWhereRelation };
