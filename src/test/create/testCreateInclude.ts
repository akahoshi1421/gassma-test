import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { postData } from "../../consts/postData";

function testCreateInclude() {
  const client = new GassmaClient();

  testCreateIncludeManyToOne(client);
  testCreateIncludeOneToMany(client);
  testCreateIncludeWithOmit(client);

  Logger.log("✅ testCreateInclude: all passed");
}

function testCreateIncludeManyToOne(client: GassmaClient) {
  const result = client.Post.create({
    data: {
      id: 951,
      title: "IncludeTestPost",
      content: "test",
      published: false,
      viewCount: 0,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
    include: { author: true },
  });

  if (!("author" in result)) {
    throw new Error("create include M:1: author missing");
  }
  const author = result.author as Record<string, unknown>;
  assertEquals(author.id, 1, "create include M:1 author id");

  resetSheet("Post", postData);
}

function testCreateIncludeOneToMany(client: GassmaClient) {
  const result = client.Post.create({
    data: {
      id: 952,
      title: "IncludeCommentsPost",
      content: "test",
      published: true,
      viewCount: 0,
      authorId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
    include: { comments: true },
  });

  if (!("comments" in result)) {
    throw new Error("create include 1:M: comments missing");
  }
  const comments = result.comments as unknown[];
  if (!Array.isArray(comments)) {
    throw new Error("create include 1:M: comments not array");
  }

  resetSheet("Post", postData);
}

function testCreateIncludeWithOmit(client: GassmaClient) {
  const result = client.Post.create({
    data: {
      id: 953,
      title: "IncludeOmitPost",
      content: "test",
      published: false,
      viewCount: 0,
      authorId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
    },
    include: { author: true },
    omit: { content: true },
  });

  if (!("author" in result)) {
    throw new Error("create include+omit: author missing");
  }
  const keys = Object.keys(result);
  if (keys.indexOf("content") !== -1) {
    throw new Error("create include+omit: content should be omitted");
  }
  assertEquals(result.title, "IncludeOmitPost", "create include+omit title");

  resetSheet("Post", postData);
}

export { testCreateInclude };
