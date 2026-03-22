import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { postData } from "../../consts/postData";

function testCreateManyAndReturnOptions() {
  const client = new GassmaClient();

  testCreateManyAndReturnSelect(client);
  testCreateManyAndReturnOmit(client);
  testCreateManyAndReturnInclude(client);

  Logger.log("✅ testCreateManyAndReturnOptions: all passed");
}

function testCreateManyAndReturnSelect(client: GassmaClient) {
  const result = client.Tag.createManyAndReturn({
    data: [
      { id: 921, name: "SelectTag1" },
      { id: 922, name: "SelectTag2" },
    ],
    select: { name: true },
  });

  assertEquals(result.length, 2, "createManyAndReturn select length");
  assertDeepEquals(
    Object.keys(result[0]).sort(),
    ["name"],
    "createManyAndReturn select keys",
  );
  assertEquals(result[0].name, "SelectTag1", "createManyAndReturn select first name");
  assertEquals(result[1].name, "SelectTag2", "createManyAndReturn select second name");

  resetSheet("Tag", tagData);
}

function testCreateManyAndReturnOmit(client: GassmaClient) {
  const result = client.Tag.createManyAndReturn({
    data: [
      { id: 931, name: "OmitTag1" },
      { id: 932, name: "OmitTag2" },
    ],
    omit: { id: true },
  });

  assertEquals(result.length, 2, "createManyAndReturn omit length");
  const keys = Object.keys(result[0]);
  if (keys.indexOf("id") !== -1) {
    throw new Error("createManyAndReturn omit: id should be omitted");
  }
  if (keys.indexOf("name") === -1) {
    throw new Error("createManyAndReturn omit: name should be present");
  }
  assertEquals(result[0].name, "OmitTag1", "createManyAndReturn omit first name");

  resetSheet("Tag", tagData);
}

function testCreateManyAndReturnInclude(client: GassmaClient) {
  const result = client.Post.createManyAndReturn({
    data: [
      {
        id: 941,
        title: "IncludePost1",
        content: "test content",
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

  assertEquals(result.length, 1, "createManyAndReturn include length");
  if (!("author" in result[0])) {
    throw new Error("createManyAndReturn include: author missing");
  }
  const author = result[0].author as Record<string, unknown>;
  assertEquals(author.id, 1, "createManyAndReturn include author id");

  resetSheet("Post", postData);
}

export { testCreateManyAndReturnOptions };
