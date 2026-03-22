import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";
import { profileData } from "../../consts/profileData";
import { postData } from "../../consts/postData";
import { commentData } from "../../consts/commentData";
import { categoryData } from "../../consts/categoryData";
import { orderData } from "../../consts/orderData";

function testOnUpdate() {
  const client = new GassmaClient();

  testOnUpdateCascadeUserProfile(client);
  testOnUpdateCascadeUserPosts(client);
  testOnUpdateSetNullCategoryPosts(client);
  testOnUpdateNoActionComments(client);
  testOnUpdateRestrict(client);

  Logger.log("✅ testOnUpdate: all passed");
}

function resetUserRelated() {
  resetSheet("User", userData);
  resetSheet("Profile", profileData);
  resetSheet("Post", postData);
  resetSheet("Comment", commentData);
  resetSheet("Order", orderData);
}

function testOnUpdateCascadeUserProfile(client: GassmaClient) {
  // テスト用 User を作成（Order なし → Restrict に引っかからない）
  client.User.create({
    data: {
      id: 951,
      email: "cascade-update@test.com",
      name: "CascadeUpdate",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 951, bio: "cascade update test", userId: 951 },
      },
    },
  });

  client.User.update({
    where: { id: 951 },
    data: { id: 961 },
  });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowNotExists({ userId: 951 });
  profileSnapshot.assertRowExists({ userId: 961 });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowNotExists({ id: 951 });
  userSnapshot.assertRowExists({ id: 961 });

  resetUserRelated();
}

function testOnUpdateCascadeUserPosts(client: GassmaClient) {
  // テスト用 User + Post を作成
  client.User.create({
    data: {
      id: 951,
      email: "cascade-posts@test.com",
      name: "CascadePosts",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 951, bio: "test", userId: 951 },
      },
      posts: {
        create: [
          { id: 951, title: "cascade post 1", published: true, viewCount: 0, authorId: 951, createdAt: new Date("2025-01-01T00:00:00") },
          { id: 952, title: "cascade post 2", published: true, viewCount: 0, authorId: 951, createdAt: new Date("2025-01-01T00:00:00") },
        ],
      },
    },
  });

  client.User.update({
    where: { id: 951 },
    data: { id: 961 },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals({ id: 951 }, { authorId: 961 });
  postSnapshot.assertRowEquals({ id: 952 }, { authorId: 961 });

  Logger.log("  Cascade posts: 2 posts updated authorId to 961");

  resetUserRelated();
}

function testOnUpdateSetNullCategoryPosts(client: GassmaClient) {
  // Category.posts は onUpdate: SetNull
  const postsBefore = client.Post.findMany({
    where: { categoryId: 1 },
    select: { id: true },
  });

  client.Category.update({
    where: { id: 1 },
    data: { id: 901 },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postsBefore.forEach((post) => {
    postSnapshot.assertRowExists({ id: post.id });
    postSnapshot.assertRowEquals({ id: post.id }, { categoryId: "" });
  });

  const categorySnapshot = getSheetSnapshot("Category");
  categorySnapshot.assertRowNotExists({ id: 1 });
  categorySnapshot.assertRowExists({ id: 901 });

  Logger.log(`  SetNull: ${postsBefore.length} posts set categoryId=null`);

  resetSheet("Category", categoryData);
  resetSheet("Post", postData);
}

function testOnUpdateNoActionComments(client: GassmaClient) {
  // テスト用 User + Comment を作成
  client.User.create({
    data: {
      id: 951,
      email: "noaction@test.com",
      name: "NoAction",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 951, bio: "test", userId: 951 },
      },
      comments: {
        create: [
          { id: 951, text: "noaction comment", authorId: 951, postId: 1, createdAt: new Date("2025-01-01T00:00:00") },
        ],
      },
    },
  });

  client.User.update({
    where: { id: 951 },
    data: { id: 961 },
  });

  // Comment の authorId はそのまま（NoAction）
  const commentSnapshot = getSheetSnapshot("Comment");
  commentSnapshot.assertRowEquals({ id: 951 }, { authorId: 951 });

  Logger.log("  NoAction: comment kept authorId=951");

  resetUserRelated();
}

function testOnUpdateRestrict(client: GassmaClient) {
  // User id=8 は Order を持つ → Restrict でエラー
  let caught = false;
  try {
    client.User.update({
      where: { id: 8 },
      data: { id: 908 },
    });
  } catch (e) {
    caught = true;
  }

  assertEquals(caught, true, "onUpdate Restrict should throw for User with Orders");

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowExists({ id: 8 });
}

export { testOnUpdate };
