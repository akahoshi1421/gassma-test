import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";
import { profileData } from "../../consts/profileData";
import { postData } from "../../consts/postData";
import { commentData } from "../../consts/commentData";
import { categoryData } from "../../consts/categoryData";
import { orderData } from "../../consts/orderData";
import { orderItemData } from "../../consts/orderItemData";

function testOnDelete() {
  const client = new GassmaClient();

  testOnDeleteCascadeUserProfile(client);
  testOnDeleteCascadePostComments(client);
  testOnDeleteCascadeOrderItems(client);
  testOnDeleteSetNullCategoryPost(client);
  testOnDeleteSetNullSelfReferencing(client);
  testOnDeleteRestrict(client);
  testOnDeleteRestrictProduct(client);

  Logger.log("✅ testOnDelete: all passed");
}

function testOnDeleteCascadeUserProfile(client: GassmaClient) {
  client.sheets.User.create({
    data: {
      id: 951,
      email: "cascade-test@test.com",
      name: "CascadeTest",
      isActive: true,
      role: "user",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 951, bio: "cascade test profile", userId: 951 },
      },
    },
  });

  const profileBefore = getSheetSnapshot("Profile");
  profileBefore.assertRowExists({ userId: 951 });

  client.sheets.User.delete({ where: { id: 951 } });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowNotExists({ id: 951 });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowNotExists({ userId: 951 });

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

function testOnDeleteCascadePostComments(client: GassmaClient) {
  client.sheets.Post.create({
    data: {
      id: 951,
      title: "cascade test post",
      published: true,
      viewCount: 0,
      authorId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      comments: {
        create: [
          { id: 951, text: "cascade comment 1", authorId: 2, postId: 951, createdAt: new Date("2025-01-01T00:00:00") },
          { id: 952, text: "cascade comment 2", authorId: 3, postId: 951, createdAt: new Date("2025-01-01T00:00:00") },
        ],
      },
    },
  });

  const commentBefore = getSheetSnapshot("Comment");
  commentBefore.assertRowExists({ id: 951 });
  commentBefore.assertRowExists({ id: 952 });

  client.sheets.Post.delete({ where: { id: 951 } });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowNotExists({ id: 951 });

  const commentSnapshot = getSheetSnapshot("Comment");
  commentSnapshot.assertRowNotExists({ id: 951 });
  commentSnapshot.assertRowNotExists({ id: 952 });

  resetSheet("Post", postData);
  resetSheet("Comment", commentData);
}

function testOnDeleteCascadeOrderItems(client: GassmaClient) {
  client.sheets.Order.create({
    data: {
      id: 951,
      userId: 1,
      totalAmount: 5000,
      quantity: 2,
      status: "pending",
      createdAt: new Date("2025-01-01T00:00:00"),
      items: {
        create: [
          { id: 951, orderId: 951, productId: 1, quantity: 1, unitPrice: 3000 },
          { id: 952, orderId: 951, productId: 2, quantity: 1, unitPrice: 2000 },
        ],
      },
    },
  });

  client.sheets.Order.delete({ where: { id: 951 } });

  const orderSnapshot = getSheetSnapshot("Order");
  orderSnapshot.assertRowNotExists({ id: 951 });

  const itemSnapshot = getSheetSnapshot("OrderItem");
  itemSnapshot.assertRowNotExists({ orderId: 951 });

  resetSheet("Order", orderData);
  resetSheet("OrderItem", orderItemData);
}

function testOnDeleteSetNullCategoryPost(client: GassmaClient) {
  const postsBefore = client.sheets.Post.findMany({
    where: { categoryId: 1 },
    select: { id: true },
  });

  client.sheets.Category.delete({ where: { id: 1 } });

  const categorySnapshot = getSheetSnapshot("Category");
  categorySnapshot.assertRowNotExists({ id: 1 });

  const postSnapshot = getSheetSnapshot("Post");
  postsBefore.forEach((post) => {
    postSnapshot.assertRowExists({ id: post.id });
    postSnapshot.assertRowEquals({ id: post.id }, { categoryId: "" });
  });

  Logger.log(`  SetNull: ${postsBefore.length} posts set categoryId=null`);

  resetSheet("Category", categoryData);
  resetSheet("Post", postData);
}

function testOnDeleteSetNullSelfReferencing(client: GassmaClient) {
  const childrenBefore = client.sheets.Category.findMany({
    where: { parentId: 1 },
    select: { id: true },
  });

  client.sheets.Category.delete({ where: { id: 1 } });

  const snapshot = getSheetSnapshot("Category");
  snapshot.assertRowNotExists({ id: 1 });

  childrenBefore.forEach((child) => {
    snapshot.assertRowExists({ id: child.id });
    snapshot.assertRowEquals({ id: child.id }, { parentId: "" });
  });

  Logger.log(`  SetNull (self-ref): ${childrenBefore.length} children set parentId=null`);

  resetSheet("Category", categoryData);
}

function testOnDeleteRestrict(client: GassmaClient) {
  let caught = false;
  try {
    client.sheets.User.delete({ where: { id: 8 } });
  } catch (e) {
    caught = true;
  }

  assertEquals(caught, true, "onDelete Restrict should throw for User with Orders");

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowExists({ id: 8 });
}

function testOnDeleteRestrictProduct(client: GassmaClient) {
  let caught = false;
  try {
    client.sheets.Product.delete({ where: { id: 1 } });
  } catch (e) {
    caught = true;
  }

  assertEquals(caught, true, "onDelete Restrict should throw for Product with OrderItems");

  const productSnapshot = getSheetSnapshot("Product");
  productSnapshot.assertRowExists({ id: 1 });
}

export { testOnDelete };
