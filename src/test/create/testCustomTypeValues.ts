import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";

function testCustomTypeValues() {
  const client = new GassmaClient();

  testAddTypeNumberAndBoolean(client);
  testAddTypeStringSide(client);
  testReplaceTypeLiteral(client);

  Logger.log("✅ testCustomTypeValues: all passed");
}

// addType: content(string|number) に number、rating(number|boolean) に boolean を書いて実セル経由で読み戻す
function testAddTypeNumberAndBoolean(client: GassmaClient) {
  client.Post.create({
    data: {
      id: 990,
      title: "d2 addType post",
      content: 990123,
      published: false,
      viewCount: 0,
      rating: true,
      authorId: 1,
      categoryId: null,
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals({ id: 990 }, { content: 990123, rating: true });

  const post = client.Post.findFirstOrThrow({ where: { id: 990 } });
  if (typeof post.content !== "number") {
    throw new Error(`addType content: expected number, got ${typeof post.content}`);
  }
  assertEquals(post.content, 990123, "addType content: number round trip");
  if (typeof post.rating !== "boolean") {
    throw new Error(`addType rating: expected boolean, got ${typeof post.rating}`);
  }
  assertEquals(post.rating, true, "addType rating: boolean round trip");
}

function testAddTypeStringSide(client: GassmaClient) {
  client.Post.update({
    where: { id: 990 },
    data: { content: "d2 addType string", rating: 4.5 },
  });

  const snapshot = getSheetSnapshot("Post");
  snapshot.assertRowEquals({ id: 990 }, { content: "d2 addType string", rating: 4.5 });

  const post = client.Post.findFirstOrThrow({ where: { id: 990 } });
  if (typeof post.content !== "string") {
    throw new Error(`addType content: expected string, got ${typeof post.content}`);
  }
  assertEquals(post.content, "d2 addType string", "addType content: string round trip");
  assertEquals(post.rating, 4.5, "addType rating: number round trip");

  client.Post.delete({ where: { id: 990 } });
}

// replaceType: status のリテラル値を書いて読み戻す
function testReplaceTypeLiteral(client: GassmaClient) {
  client.Product.create({
    data: {
      id: 990,
      name: "d2 replaceType product",
      price: 100,
      stock: 1,
      status: "soldout",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 990 }, { status: "soldout" });

  const created = client.Product.findFirstOrThrow({ where: { id: 990 } });
  assertEquals(created.status, "soldout", "replaceType status: create round trip");

  client.Product.update({
    where: { id: 990 },
    data: { status: "discontinued" },
  });
  const updated = client.Product.findFirstOrThrow({ where: { id: 990 } });
  assertEquals(updated.status, "discontinued", "replaceType status: update round trip");

  client.Product.delete({ where: { id: 990 } });
}

export { testCustomTypeValues };
