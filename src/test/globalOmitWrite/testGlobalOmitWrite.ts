import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { postData } from "../../consts/postData";

function testGlobalOmitWrite() {
  testGlobalOmitCreateIncludeOmit();
  testGlobalOmitUpdateInclude();
  testGlobalOmitCreateManyAndReturnInclude();
  testGlobalOmitUpsertInclude();
  testGlobalOmitDeleteInclude();
  testGlobalOmitWriteNonRegression();

  Logger.log("✅ testGlobalOmitWrite: all passed");
}

function testGlobalOmitCreateIncludeOmit() {
  // include + クエリ omit 併用時も globalOmit がマージされる
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  const result = client.Post.create({
    data: {
      id: 962,
      title: "GlobalOmitCreate",
      content: "secret content",
      published: false,
      viewCount: 0,
      rating: 2.5,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
    include: { author: true },
    omit: { rating: true },
  });

  const keys = Object.keys(result);
  if (keys.indexOf("content") !== -1)
    throw new Error("globalOmit create include+omit: content should be omitted (from global)");
  if (keys.indexOf("rating") !== -1)
    throw new Error("globalOmit create include+omit: rating should be omitted (from query)");
  assertEquals(result.title, "GlobalOmitCreate", "globalOmit create include+omit title");
  if (!result.author)
    throw new Error("globalOmit create include+omit: author missing");
  assertEquals(result.author.id, 1, "globalOmit create include+omit author id");

  resetSheet("Post", postData);
}

function testGlobalOmitUpdateInclude() {
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  const merged = client.Post.update({
    where: { id: 1 },
    data: { title: "GlobalOmitUpdate" },
    include: { author: true },
    omit: { viewCount: true },
  });
  if (!merged) throw new Error("globalOmit update include+omit: expected result");
  const mergedKeys = Object.keys(merged);
  if (mergedKeys.indexOf("content") !== -1)
    throw new Error("globalOmit update include+omit: content should be omitted (from global)");
  if (mergedKeys.indexOf("viewCount") !== -1)
    throw new Error("globalOmit update include+omit: viewCount should be omitted (from query)");
  assertEquals(merged.title, "GlobalOmitUpdate", "globalOmit update include+omit title");
  if (!merged.author)
    throw new Error("globalOmit update include+omit: author missing");

  // omit: { field: false } で globalOmit を解除できる
  const unset = client.Post.update({
    where: { id: 1 },
    data: { title: "GlobalOmitUpdateFalse" },
    include: { author: true },
    omit: { content: false },
  });
  if (!unset) throw new Error("globalOmit update omit false: expected result");
  const unsetKeys = Object.keys(unset);
  if (unsetKeys.indexOf("content") === -1)
    throw new Error("globalOmit update omit false: content should be present (overridden by false)");
  if (!unset.author)
    throw new Error("globalOmit update omit false: author missing");

  resetSheet("Post", postData);
}

function testGlobalOmitCreateManyAndReturnInclude() {
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  const result = client.Post.createManyAndReturn({
    data: [
      {
        id: 963,
        title: "GlobalOmitCmar",
        content: "secret content",
        published: true,
        viewCount: 0,
        authorId: 1,
        categoryId: 1,
        createdAt: new Date("2025-01-01T00:00:00"),
        updatedAt: new Date("2025-01-01T00:00:00"),
      },
    ],
    include: { author: true },
  });

  assertEquals(result.length, 1, "globalOmit createManyAndReturn include length");
  const keys = Object.keys(result[0]);
  if (keys.indexOf("content") !== -1)
    throw new Error("globalOmit createManyAndReturn include: content should be omitted");
  assertEquals(result[0].title, "GlobalOmitCmar", "globalOmit createManyAndReturn include title");
  if (!result[0].author)
    throw new Error("globalOmit createManyAndReturn include: author missing");

  resetSheet("Post", postData);
}

function testGlobalOmitUpsertInclude() {
  // 修正前は upsert の include 経路で omit が全落ちしていた
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  // update 経路
  const updated = client.Post.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      title: "ShouldNotCreate",
      content: "unused",
      published: false,
      viewCount: 0,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
    update: { title: "GlobalOmitUpsertUpdate" },
    include: { author: true },
  });
  const updatedKeys = Object.keys(updated);
  if (updatedKeys.indexOf("content") !== -1)
    throw new Error("globalOmit upsert update path: content should be omitted");
  assertEquals(updated.title, "GlobalOmitUpsertUpdate", "globalOmit upsert update path title");
  if (!updated.author)
    throw new Error("globalOmit upsert update path: author missing");

  resetSheet("Post", postData);

  // create 経路
  const created = client.Post.upsert({
    where: { id: 964 },
    create: {
      id: 964,
      title: "GlobalOmitUpsertCreate",
      content: "secret content",
      published: false,
      viewCount: 0,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
    update: { title: "ShouldNotUpdate" },
    include: { author: true },
  });
  const createdKeys = Object.keys(created);
  if (createdKeys.indexOf("content") !== -1)
    throw new Error("globalOmit upsert create path: content should be omitted");
  assertEquals(created.title, "GlobalOmitUpsertCreate", "globalOmit upsert create path title");
  if (!created.author)
    throw new Error("globalOmit upsert create path: author missing");

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowExists({ id: 964 });

  resetSheet("Post", postData);
}

function testGlobalOmitDeleteInclude() {
  // 修正前は delete の include 経路で omit が全落ちしていた
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  client.Post.create({
    data: {
      id: 965,
      title: "GlobalOmitDelete",
      content: "secret content",
      published: false,
      viewCount: 0,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
  });
  const result = client.Post.delete({
    where: { id: 965 },
    include: { author: true },
  });
  if (!result) throw new Error("globalOmit delete include: expected result");
  const keys = Object.keys(result);
  if (keys.indexOf("content") !== -1)
    throw new Error("globalOmit delete include: content should be omitted");
  assertEquals(result.title, "GlobalOmitDelete", "globalOmit delete include title");
  if (!result.author)
    throw new Error("globalOmit delete include: author missing");

  // omit: { field: false } で globalOmit を解除できる
  client.Post.create({
    data: {
      id: 965,
      title: "GlobalOmitDelete",
      content: "secret content",
      published: false,
      viewCount: 0,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
  });
  const unset = client.Post.delete({
    where: { id: 965 },
    include: { author: true },
    omit: { content: false },
  });
  if (!unset) throw new Error("globalOmit delete omit false: expected result");
  const unsetKeys = Object.keys(unset);
  if (unsetKeys.indexOf("content") === -1)
    throw new Error("globalOmit delete omit false: content should be present (overridden by false)");
  if (!unset.author)
    throw new Error("globalOmit delete omit false: author missing");

  resetSheet("Post", postData);
}

function testGlobalOmitWriteNonRegression() {
  // globalOmit 無しクライアントの include+omit は従来通りクエリ omit のみ適用
  const client = new GassmaClient();

  const result = client.Post.create({
    data: {
      id: 966,
      title: "PlainCreate",
      content: "visible content",
      published: false,
      viewCount: 0,
      rating: 1.5,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
    include: { author: true },
    omit: { rating: true },
  });

  const keys = Object.keys(result);
  if (keys.indexOf("rating") !== -1)
    throw new Error("plain create include+omit: rating should be omitted");
  if (keys.indexOf("content") === -1)
    throw new Error("plain create include+omit: content should be present");
  assertEquals(result.content, "visible content", "plain create include+omit content value");
  if (!result.author)
    throw new Error("plain create include+omit: author missing");

  resetSheet("Post", postData);
}

export { testGlobalOmitWrite };
