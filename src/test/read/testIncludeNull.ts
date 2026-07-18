import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";

function testIncludeNull() {
  const client = new GassmaClient();

  testManyToOneNull(client);
  testOneToOneNull(client);

  Logger.log("✅ testIncludeNull: all passed");
}

function testManyToOneNull(client: GassmaClient) {
  // consts: Post id 9 は categoryId が null
  const post = client.Post.findFirst({
    where: { id: 9 },
    include: { category: true },
  });
  if (!post) throw new Error("include null: post 9 not found");

  assertEquals(post.categoryId, null, "include null: categoryId");
  if (!("category" in post)) {
    throw new Error("include null: category key missing");
  }
  if (post.category !== null) {
    throw new Error(`include null: category should be null, got ${JSON.stringify(post.category)}`);
  }
}

function testOneToOneNull(client: GassmaClient) {
  // consts では全 User が Profile を持つため、Profile なし User を作成して検証
  client.User.create({
    data: {
      id: 981,
      email: "c3-noprofile@test.com",
      name: "NoProfileUser",
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const user = client.User.findFirst({
    where: { id: 981 },
    include: { profile: true },
  });
  if (!user) throw new Error("include null: user 981 not found");

  if (!("profile" in user)) {
    throw new Error("include null: profile key missing");
  }
  if (user.profile !== null) {
    throw new Error(`include null: profile should be null, got ${JSON.stringify(user.profile)}`);
  }

  resetSheet("User", userData);
}

export { testIncludeNull };
