import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";

function testSetNullReadBack() {
  const client = new GassmaClient();

  testSetNullOrmReadBack(client);
  testExplicitNullCreate(client);
  testExplicitNullUpdate(client);

  Logger.log("✅ testSetNullReadBack: all passed");
}

// SetNull で空になったセルが ORM 経由では null として読み戻せる
function testSetNullOrmReadBack(client: GassmaClient) {
  client.Category.create({ data: { id: 990, name: "d3 setnull category" } });
  client.Post.create({
    data: {
      id: 990,
      title: "d3 setnull post",
      published: false,
      viewCount: 0,
      authorId: 1,
      categoryId: 990,
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  client.Category.delete({ where: { id: 990 } });

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals({ id: 990 }, { categoryId: "" });

  const post = client.Post.findFirstOrThrow({ where: { id: 990 } });
  assertEquals(post.categoryId, null, "SetNull: ORM read back null");

  client.Post.delete({ where: { id: 990 } });
}

function testExplicitNullCreate(client: GassmaClient) {
  client.Post.create({
    data: {
      id: 991,
      title: "d3 explicit null post",
      content: null,
      published: false,
      viewCount: 0,
      rating: null,
      authorId: 1,
      categoryId: null,
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals(
    { id: 991 },
    { categoryId: "", content: "", rating: "" },
  );

  const post = client.Post.findFirstOrThrow({ where: { id: 991 } });
  assertEquals(post.categoryId, null, "explicit null create: categoryId");
  assertEquals(post.content, null, "explicit null create: content");
  assertEquals(post.rating, null, "explicit null create: rating");
}

function testExplicitNullUpdate(client: GassmaClient) {
  client.Post.update({ where: { id: 991 }, data: { categoryId: 5 } });
  const filled = client.Post.findFirstOrThrow({ where: { id: 991 } });
  assertEquals(filled.categoryId, 5, "explicit null update: value set");

  client.Post.update({ where: { id: 991 }, data: { categoryId: null } });

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals({ id: 991 }, { categoryId: "" });

  const post = client.Post.findFirstOrThrow({ where: { id: 991 } });
  assertEquals(post.categoryId, null, "explicit null update: ORM read back null");

  client.Post.delete({ where: { id: 991 } });
}

export { testSetNullReadBack };
