import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { orderData } from "../../consts/orderData";
import { orderItemData } from "../../consts/orderItemData";
import { categoryData } from "../../consts/categoryData";
import { profileData } from "../../consts/profileData";
import { userData } from "../../consts/userData";
import { postData } from "../../consts/postData";
import { tagData } from "../../consts/tagData";
import { postToTagData } from "../../consts/postToTagData";

function testNestedCreate() {
  const client = new GassmaClient();

  testNestedCreateOneToMany(client);
  testNestedCreateOneToOne(client);
  testNestedCreateConnect(client);
  testNestedCreateConnectOrCreateNew(client);
  testNestedCreateConnectOrCreateExisting(client);
  testNestedCreateSelfReferencing(client);
  testNestedCreateOneToManyCreateMany(client);
  testNestedCreateManyToManyCreate(client);
  testNestedCreateManyToOneCreate(client);
  testNestedCreateDeepNest(client);

  Logger.log("✅ testNestedCreate: all passed");
}

function testNestedCreateOneToMany(client: GassmaClient) {
  client.Order.create({
    data: {
      id: 901,
      userId: 1,
      totalAmount: 5000,
      quantity: 2,
      status: "pending",
      createdAt: new Date("2025-01-01T00:00:00"),
      items: {
        create: [
          { id: 901, orderId: 901, productId: 1, quantity: 1, unitPrice: 3000 },
          { id: 902, orderId: 901, productId: 2, quantity: 1, unitPrice: 2000 },
        ],
      },
    },
  });

  const orderSnapshot = getSheetSnapshot("Order");
  orderSnapshot.assertRowExists({ id: 901 });
  orderSnapshot.assertRowEquals({ id: 901 }, { total_amount: 5000, status: "pending" });

  const itemSnapshot = getSheetSnapshot("OrderItem");
  itemSnapshot.assertRowExists({ id: 901, orderId: 901 });
  itemSnapshot.assertRowExists({ id: 902, orderId: 901 });
  itemSnapshot.assertRowEquals({ id: 901 }, { productId: 1, unitPrice: 3000 });
  itemSnapshot.assertRowEquals({ id: 902 }, { productId: 2, unitPrice: 2000 });

  resetSheet("Order", orderData);
  resetSheet("OrderItem", orderItemData);
}

function testNestedCreateOneToOne(client: GassmaClient) {
  client.User.create({
    data: {
      id: 901,
      email: "nested@test.com",
      name: "NestedUser",
      isActive: true,
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      profile: {
        create: { id: 901, bio: "テストプロフィール", userId: 901 },
      },
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowExists({ id: 901 });
  userSnapshot.assertRowEquals({ id: 901 }, { email: "nested@test.com" });

  const profileSnapshot = getSheetSnapshot("Profile");
  profileSnapshot.assertRowExists({ id: 901, userId: 901 });
  profileSnapshot.assertRowEquals({ id: 901 }, { bio: "テストプロフィール" });

  resetSheet("User", userData);
  resetSheet("Profile", profileData);
}

function testNestedCreateConnect(client: GassmaClient) {
  client.Order.create({
    data: {
      id: 902,
      userId: 1,
      totalAmount: 8000,
      quantity: 1,
      status: "shipped",
      createdAt: new Date("2025-02-01T00:00:00"),
      items: {
        connect: { id: 1 },
      },
    },
  });

  const orderSnapshot = getSheetSnapshot("Order");
  orderSnapshot.assertRowExists({ id: 902 });

  const itemSnapshot = getSheetSnapshot("OrderItem");
  itemSnapshot.assertRowEquals({ id: 1 }, { orderId: 902 });

  resetSheet("Order", orderData);
  resetSheet("OrderItem", orderItemData);
}

function testNestedCreateConnectOrCreateNew(client: GassmaClient) {
  client.Order.create({
    data: {
      id: 903,
      userId: 1,
      totalAmount: 12000,
      quantity: 1,
      status: "pending",
      createdAt: new Date("2025-03-01T00:00:00"),
      items: {
        connectOrCreate: {
          where: { id: 999 },
          create: { id: 903, orderId: 903, productId: 3, quantity: 2, unitPrice: 6000 },
        },
      },
    },
  });

  const orderSnapshot = getSheetSnapshot("Order");
  orderSnapshot.assertRowExists({ id: 903 });

  const itemSnapshot = getSheetSnapshot("OrderItem");
  itemSnapshot.assertRowExists({ id: 903, orderId: 903 });
  itemSnapshot.assertRowEquals({ id: 903 }, { productId: 3, unitPrice: 6000 });

  resetSheet("Order", orderData);
  resetSheet("OrderItem", orderItemData);
}

function testNestedCreateConnectOrCreateExisting(client: GassmaClient) {
  client.Order.create({
    data: {
      id: 904,
      userId: 1,
      totalAmount: 9000,
      quantity: 1,
      status: "pending",
      createdAt: new Date("2025-04-01T00:00:00"),
      items: {
        connectOrCreate: {
          where: { id: 1 },
          create: { id: 999, orderId: 904, productId: 1, quantity: 1, unitPrice: 9000 },
        },
      },
    },
  });

  const orderSnapshot = getSheetSnapshot("Order");
  orderSnapshot.assertRowExists({ id: 904 });

  const itemSnapshot = getSheetSnapshot("OrderItem");
  itemSnapshot.assertRowEquals({ id: 1 }, { orderId: 904 });
  itemSnapshot.assertRowNotExists({ id: 999 });

  resetSheet("Order", orderData);
  resetSheet("OrderItem", orderItemData);
}

function testNestedCreateSelfReferencing(client: GassmaClient) {
  client.Category.create({
    data: {
      id: 901,
      name: "親カテゴリ",
      children: {
        create: [
          { id: 902, name: "子カテゴリ1", parentId: 901 },
          { id: 903, name: "子カテゴリ2", parentId: 901 },
        ],
      },
    },
  });

  const snapshot = getSheetSnapshot("Category");
  snapshot.assertRowExists({ id: 901 });
  snapshot.assertRowEquals({ id: 901 }, { name: "親カテゴリ" });
  snapshot.assertRowExists({ id: 902, parentId: 901 });
  snapshot.assertRowExists({ id: 903, parentId: 901 });

  resetSheet("Category", categoryData);
}

function testNestedCreateOneToManyCreateMany(client: GassmaClient) {
  client.User.create({
    data: {
      id: 976,
      email: "nestedcm@test.com",
      name: "NestedCreateManyUser",
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      posts: {
        createMany: {
          data: [
            { id: 976, title: "CreateManyPost1" },
            { id: 977, title: "CreateManyPost2" },
          ],
        },
      },
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowExists({ id: 976 });

  // authorId は親の id が自動セットされ、Post の defaults も適用される
  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals(
    { id: 976 },
    { authorId: 976, title: "CreateManyPost1", published: false, viewCount: 0 },
  );
  postSnapshot.assertRowEquals(
    { id: 977 },
    { authorId: 976, title: "CreateManyPost2" },
  );

  resetSheet("User", userData);
  resetSheet("Post", postData);
}

function testNestedCreateManyToManyCreate(client: GassmaClient) {
  client.Post.create({
    data: {
      id: 976,
      title: "ManyToManyNestedPost",
      authorId: 1,
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
      tags: {
        create: [
          { id: 976, name: "NestedTagA" },
          { id: 977, name: "NestedTagB" },
        ],
      },
    },
  });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowExists({ id: 976 });

  const tagSnapshot = getSheetSnapshot("Tag");
  tagSnapshot.assertRowEquals({ id: 976 }, { name: "NestedTagA" });
  tagSnapshot.assertRowEquals({ id: 977 }, { name: "NestedTagB" });

  const pivotSnapshot = getSheetSnapshot("_PostToTag");
  pivotSnapshot.assertRowExists({ postId: 976, tagId: 976 });
  pivotSnapshot.assertRowExists({ postId: 976, tagId: 977 });

  resetSheet("Post", postData);
  resetSheet("Tag", tagData);
  resetSheet("_PostToTag", postToTagData);
}

function testNestedCreateManyToOneCreate(client: GassmaClient) {
  const result = client.Post.create({
    data: {
      id: 977,
      title: "ManyToOneNestedPost",
      createdAt: new Date("2025-01-01T00:00:00"),
      updatedAt: new Date("2025-01-01T00:00:00"),
      author: {
        create: {
          id: 977,
          email: "nestedauthor@test.com",
          name: "NestedAuthor",
          role: "USER",
          createdAt: new Date("2025-01-01T00:00:00"),
        },
      },
    },
  });

  // 先に User が作成され、その id が Post の authorId にセットされる
  assertEquals(result.authorId, 977, "manyToOne nested create: returned authorId");

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowEquals({ id: 977 }, { name: "NestedAuthor" });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals({ id: 977 }, { authorId: 977, title: "ManyToOneNestedPost" });

  resetSheet("User", userData);
  resetSheet("Post", postData);
}

function testNestedCreateDeepNest(client: GassmaClient) {
  // User → posts → tags を 1 回の create で作成（reference nestedWrite.md 深いネスト）
  client.User.create({
    data: {
      id: 978,
      email: "deepnest@test.com",
      name: "DeepNestUser",
      role: "USER",
      createdAt: new Date("2025-01-01T00:00:00"),
      posts: {
        create: {
          id: 978,
          title: "DeepNestPost",
          tags: {
            create: { id: 978, name: "DeepNestTag" },
          },
        },
      },
    },
  });

  const userSnapshot = getSheetSnapshot("User");
  userSnapshot.assertRowExists({ id: 978 });

  const postSnapshot = getSheetSnapshot("Post");
  postSnapshot.assertRowEquals({ id: 978 }, { authorId: 978, title: "DeepNestPost" });

  const tagSnapshot = getSheetSnapshot("Tag");
  tagSnapshot.assertRowEquals({ id: 978 }, { name: "DeepNestTag" });

  const pivotSnapshot = getSheetSnapshot("_PostToTag");
  pivotSnapshot.assertRowExists({ postId: 978, tagId: 978 });

  resetSheet("User", userData);
  resetSheet("Post", postData);
  resetSheet("Tag", tagData);
  resetSheet("_PostToTag", postToTagData);
}

export { testNestedCreate };
