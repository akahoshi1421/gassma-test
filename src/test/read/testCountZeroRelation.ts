import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";

function testCountZeroRelation() {
  const client = new GassmaClient();

  // consts では全 User が posts/comments/orders/profile を持つため、関連 0 件の User を作成して検証
  client.User.create({
    data: {
      id: 980,
      email: "c1-zero@test.com",
      name: "ZeroRelUser",
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const user = client.User.findFirst({
    where: { id: 980 },
    include: { _count: true },
  });
  if (!user) throw new Error("count zero relation: user 980 not found");

  assertEquals(Object.keys(user._count).length, 4, "count zero: relation key count");
  assertEquals(user._count.posts, 0, "count zero: posts");
  assertEquals(user._count.comments, 0, "count zero: comments");
  assertEquals(user._count.orders, 0, "count zero: orders");
  assertEquals(user._count.profile, 0, "count zero: profile");

  const filtered = client.User.findFirst({
    where: { id: 980 },
    include: { _count: { select: { posts: { where: { published: true } } } } },
  });
  if (!filtered) throw new Error("count zero relation: filtered user 980 not found");
  assertEquals(filtered._count.posts, 0, "count zero: posts with where");

  resetSheet("User", userData);

  Logger.log("✅ testCountZeroRelation: all passed");
}

export { testCountZeroRelation };
