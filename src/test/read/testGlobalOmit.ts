import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

function testGlobalOmit() {
  testGlobalOmitFindFirst();
  testGlobalOmitFindMany();
  testGlobalOmitMultipleModels();
  testGlobalOmitOverrideBySelect();
  testGlobalOmitOverrideByOmit();
  testGlobalOmitFalseOverride();

  Logger.log("✅ testGlobalOmit: all passed");
}

function testGlobalOmitFindFirst() {
  const client = new GassmaClient({
    omit: { User: { createdAt: true, age: true } },
  });

  const user = client.sheets.User.findFirst({ where: { id: 1 } });
  if (!user) throw new Error("globalOmit findFirst: got null");

  const keys = Object.keys(user);
  if (keys.indexOf("createdAt") !== -1) {
    throw new Error("globalOmit findFirst: createdAt should be omitted");
  }
  if (keys.indexOf("age") !== -1) {
    throw new Error("globalOmit findFirst: age should be omitted");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("globalOmit findFirst: id should be present");
  }
  if (keys.indexOf("name") === -1) {
    throw new Error("globalOmit findFirst: name should be present");
  }
}

function testGlobalOmitFindMany() {
  const client = new GassmaClient({
    omit: { User: { email: true } },
  });

  const users = client.sheets.User.findMany({ where: { id: 1 } });
  assertEquals(users.length, 1, "globalOmit findMany count");

  const keys = Object.keys(users[0]);
  if (keys.indexOf("email") !== -1) {
    throw new Error("globalOmit findMany: email should be omitted");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("globalOmit findMany: id should be present");
  }
}

function testGlobalOmitMultipleModels() {
  const client = new GassmaClient({
    omit: {
      User: { createdAt: true },
      Post: { content: true, rating: true },
    },
  });

  const user = client.sheets.User.findFirst({ where: { id: 1 } });
  if (!user) throw new Error("globalOmit multi: user null");
  if (Object.keys(user).indexOf("createdAt") !== -1) {
    throw new Error("globalOmit multi: User.createdAt should be omitted");
  }

  const post = client.sheets.Post.findFirst({ where: { id: 1 } });
  if (!post) throw new Error("globalOmit multi: post null");
  const postKeys = Object.keys(post);
  if (postKeys.indexOf("content") !== -1) {
    throw new Error("globalOmit multi: Post.content should be omitted");
  }
  if (postKeys.indexOf("rating") !== -1) {
    throw new Error("globalOmit multi: Post.rating should be omitted");
  }
  if (postKeys.indexOf("title") === -1) {
    throw new Error("globalOmit multi: Post.title should be present");
  }
}

function testGlobalOmitOverrideBySelect() {
  // select を指定すると globalOmit は無視される（Prisma の仕様）
  const client = new GassmaClient({
    omit: { User: { createdAt: true, age: true } },
  });

  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    select: { id: true, createdAt: true },
  });
  if (!user) throw new Error("globalOmit select override: got null");

  assertDeepEquals(Object.keys(user).sort(), ["createdAt", "id"], "globalOmit select override keys");
}

function testGlobalOmitOverrideByOmit() {
  // クエリ level の omit は globalOmit とマージされる（Prisma の仕様）
  const client = new GassmaClient({
    omit: { User: { createdAt: true } },
  });

  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    omit: { email: true },
  });
  if (!user) throw new Error("globalOmit omit override: got null");

  const keys = Object.keys(user);
  if (keys.indexOf("createdAt") !== -1) {
    throw new Error("globalOmit omit override: createdAt should be omitted (from global)");
  }
  if (keys.indexOf("email") !== -1) {
    throw new Error("globalOmit omit override: email should be omitted (from query)");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("globalOmit omit override: id should be present");
  }
}

function testGlobalOmitFalseOverride() {
  // omit: { field: false } でグローバルomitを解除できる（Prisma の仕様）
  const client = new GassmaClient({
    omit: { User: { createdAt: true, age: true } },
  });

  // createdAt を false で解除、age はグローバルomitのまま
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    omit: { createdAt: false },
  });
  if (!user) throw new Error("globalOmit false override: got null");

  const keys = Object.keys(user);
  if (keys.indexOf("createdAt") === -1) {
    throw new Error("globalOmit false override: createdAt should be present (overridden by false)");
  }
  if (keys.indexOf("age") !== -1) {
    throw new Error("globalOmit false override: age should still be omitted");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("globalOmit false override: id should be present");
  }

  // findMany でも同様
  const users = client.sheets.User.findMany({
    where: { id: 1 },
    omit: { createdAt: false, age: false },
  });
  assertEquals(users.length, 1, "globalOmit false override findMany count");

  const manyKeys = Object.keys(users[0]);
  if (manyKeys.indexOf("createdAt") === -1) {
    throw new Error("globalOmit false override findMany: createdAt should be present");
  }
  if (manyKeys.indexOf("age") === -1) {
    throw new Error("globalOmit false override findMany: age should be present");
  }
}

export { testGlobalOmit };
