import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { postData } from "../../consts/postData";

function testUpsertCreatePath() {
  const client = new GassmaClient();

  testUpsertCreateSelect(client);
  testUpsertCreateInclude(client);

  Logger.log("✅ testUpsertCreatePath: all passed");
}

function testUpsertCreateSelect(client: GassmaClient) {
  // 存在しない id → create 経路で select
  const result = client.Tag.upsert({
    where: { id: 982 },
    create: { id: 982, name: "CreatePathSelect" },
    update: { name: "ShouldNotUpdate" },
    select: { id: true },
  });

  assertDeepEquals(Object.keys(result).sort(), ["id"], "upsert create select keys");
  assertEquals(result.id, 982, "upsert create select id");

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowEquals({ id: 982 }, { name: "CreatePathSelect" });

  resetSheet("Tag", tagData);
}

function testUpsertCreateInclude(client: GassmaClient) {
  // 存在しない id → create 経路で include
  const result = client.Post.upsert({
    where: { id: 983 },
    create: {
      id: 983,
      title: "upsert create include",
      published: true,
      viewCount: 1,
      authorId: 1,
      categoryId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
    },
    update: { title: "ShouldNotUpdate" },
    include: { author: true, category: true },
  });

  assertEquals(result.id, 983, "upsert create include id");
  assertEquals(result.title, "upsert create include", "upsert create include title");
  if (!result.author) throw new Error("upsert create include: author missing");
  assertEquals(result.author.id, 1, "upsert create include author id");
  assertEquals(result.author.name, "Chris Jackson", "upsert create include author name");
  if (!result.category) throw new Error("upsert create include: category missing");
  assertEquals(result.category.id, 1, "upsert create include category id");
  assertEquals(result.category.name, "テクノロジー", "upsert create include category name");

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals({ id: 983 }, { title: "upsert create include", authorId: 1, categoryId: 1 });

  resetSheet("Post", postData);
}

export { testUpsertCreatePath };
