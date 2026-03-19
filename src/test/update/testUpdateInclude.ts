import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { postData } from "../../consts/postData";

function testUpdateInclude() {
  const client = new GassmaClient();

  testUpdateIncludeManyToOne(client);
  testUpdateIncludeWithOmit(client);

  Logger.log("✅ testUpdateInclude: all passed");
}

function testUpdateIncludeManyToOne(client: GassmaClient) {
  const result = client.sheets.Post.update({
    where: { id: 1 },
    data: { title: "UpdatedWithInclude" },
    include: { author: true },
  });

  if (!result) throw new Error("update include: expected result");
  if (!("author" in result)) {
    throw new Error("update include M:1: author missing");
  }
  const author = result.author as Record<string, unknown>;
  assertEquals(typeof author.id, "number", "update include M:1 author id type");
  assertEquals(result.title, "UpdatedWithInclude", "update include title");

  resetSheet("Post", postData);
}

function testUpdateIncludeWithOmit(client: GassmaClient) {
  const result = client.sheets.Post.update({
    where: { id: 1 },
    data: { title: "UpdateIncludeOmit" },
    include: { author: true },
    omit: { content: true },
  });

  if (!result) throw new Error("update include+omit: expected result");
  if (!("author" in result)) {
    throw new Error("update include+omit: author missing");
  }
  const keys = Object.keys(result);
  if (keys.indexOf("content") !== -1) {
    throw new Error("update include+omit: content should be omitted");
  }
  assertEquals(result.title, "UpdateIncludeOmit", "update include+omit title");

  resetSheet("Post", postData);
}

export { testUpdateInclude };
