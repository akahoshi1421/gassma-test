import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";
import { postData } from "../../consts/postData";

// 1201 の新値 1202 が 1202 の旧値と一致する（玉突き）。1組ずつ適用すると
// 1201 の Post が 1202 経由で 1203 まで運ばれる。本体 #174
const LOWER_USER_ID = 1201;
const UPPER_USER_ID = 1202;
const SHIFTED_UPPER_USER_ID = 1203;
const LOWER_POST_ID = 1201;
const UPPER_POST_ID = 1202;

function testOnUpdateCascadeChain() {
  const client = new GassmaClient();

  assertFixtureIdsFree(client);

  client.User.create({
    data: {
      id: LOWER_USER_ID,
      email: "cascade-chain-lower@test.com",
      name: "CascadeChainLower",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      posts: {
        create: [
          {
            id: LOWER_POST_ID,
            title: "cascade chain lower post",
            published: true,
            viewCount: 0,
            authorId: LOWER_USER_ID,
            createdAt: new Date("2025-01-01T00:00:00"),
          },
        ],
      },
    },
  });

  client.User.create({
    data: {
      id: UPPER_USER_ID,
      email: "cascade-chain-upper@test.com",
      name: "CascadeChainUpper",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      posts: {
        create: [
          {
            id: UPPER_POST_ID,
            title: "cascade chain upper post",
            published: true,
            viewCount: 0,
            authorId: UPPER_USER_ID,
            createdAt: new Date("2025-01-01T00:00:00"),
          },
        ],
      },
    },
  });

  const result = client.User.updateMany({
    where: { id: { in: [LOWER_USER_ID, UPPER_USER_ID] } },
    data: { id: { increment: 1 } },
  });

  assertEquals(result.count, 2, "cascade chain: updateMany count");

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowNotExists({ id: LOWER_USER_ID });
  userSnapshot.assertRowEquals({ email: "cascade-chain-lower@test.com" }, { id: UPPER_USER_ID });
  userSnapshot.assertRowEquals(
    { email: "cascade-chain-upper@test.com" },
    { id: SHIFTED_UPPER_USER_ID },
  );

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals({ id: LOWER_POST_ID }, { authorId: UPPER_USER_ID });
  postSnapshot.assertRowEquals({ id: UPPER_POST_ID }, { authorId: SHIFTED_UPPER_USER_ID });

  resetSheet("User", userData);
  resetSheet("Post", postData);

  Logger.log("✅ testOnUpdateCascadeChain: all passed");
}

function assertFixtureIdsFree(client: GassmaClient) {
  const users = client.User.findMany({
    where: { id: { in: [LOWER_USER_ID, UPPER_USER_ID, SHIFTED_UPPER_USER_ID] } },
  });
  assertEquals(users.length, 0, "cascade chain: user ids must be unused");

  const posts = client.Post.findMany({
    where: { id: { in: [LOWER_POST_ID, UPPER_POST_ID] } },
  });
  assertEquals(posts.length, 0, "cascade chain: post ids must be unused");
}

export { testOnUpdateCascadeChain };
