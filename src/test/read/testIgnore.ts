import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";

function testIgnore() {
  testIgnoreFindFirst();
  testIgnoreFindMany();
  testIgnoreMultipleModels();
  testIgnoreCreateStripped();

  Logger.log("✅ testIgnore: all passed");
}

function testIgnoreFindFirst() {
  // @ignore フィールド (internalNote) が結果から除外される
  const client = new GassmaClient();

  const user = client.sheets.User.findFirst({ where: { id: 1 } });
  if (!user) throw new Error("ignore findFirst: got null");

  const keys = Object.keys(user);
  if (keys.indexOf("internalNote") !== -1) {
    throw new Error("ignore findFirst: internalNote should be ignored");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("ignore findFirst: id should be present");
  }
  if (keys.indexOf("name") === -1) {
    throw new Error("ignore findFirst: name should be present");
  }
}

function testIgnoreFindMany() {
  const client = new GassmaClient();

  const users = client.sheets.User.findMany({ where: { id: 1 } });
  assertEquals(users.length, 1, "ignore findMany count");

  const keys = Object.keys(users[0]);
  if (keys.indexOf("internalNote") !== -1) {
    throw new Error("ignore findMany: internalNote should be ignored");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("ignore findMany: id should be present");
  }
}

function testIgnoreMultipleModels() {
  // User の internalNote と Post の debugInfo が両方除外される
  const client = new GassmaClient();

  const user = client.sheets.User.findFirst({ where: { id: 1 } });
  if (!user) throw new Error("ignore multi: user null");
  if (Object.keys(user).indexOf("internalNote") !== -1) {
    throw new Error("ignore multi: User.internalNote should be ignored");
  }

  const post = client.sheets.Post.findFirst({ where: { id: 1 } });
  if (!post) throw new Error("ignore multi: post null");
  const postKeys = Object.keys(post);
  if (postKeys.indexOf("debugInfo") !== -1) {
    throw new Error("ignore multi: Post.debugInfo should be ignored");
  }
  if (postKeys.indexOf("title") === -1) {
    throw new Error("ignore multi: Post.title should be present");
  }
}

function testIgnoreCreateStripped() {
  // create 時にも ignore フィールドは結果から除外される
  const client = new GassmaClient();

  const created = client.sheets.User.create({
    data: {
      id: 9999,
      email: "ignore-test@example.com",
      name: "Ignore Test",
      role: "user",
    },
  });

  const keys = Object.keys(created);
  if (keys.indexOf("internalNote") !== -1) {
    throw new Error("ignore create: internalNote should be ignored in result");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("ignore create: id should be present");
  }

  // 後片付け
  client.sheets.User.delete({ where: { id: 9999 } });
}

export { testIgnore };
