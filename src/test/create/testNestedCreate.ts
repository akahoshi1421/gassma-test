import { GassmaClient } from "../../generated/gassma/testClient";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { orderData } from "../../consts/orderData";
import { orderItemData } from "../../consts/orderItemData";
import { categoryData } from "../../consts/categoryData";
import { profileData } from "../../consts/profileData";
import { userData } from "../../consts/userData";

function testNestedCreate() {
  const client = new GassmaClient();

  testNestedCreateOneToMany(client);
  testNestedCreateOneToOne(client);
  testNestedCreateConnect(client);
  testNestedCreateSelfReferencing(client);

  Logger.log("✅ testNestedCreate: all passed");
}

function testNestedCreateOneToMany(client: GassmaClient) {
  client.sheets.Order.create({
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
  orderSnapshot.assertRowEquals({ id: 901 }, { totalAmount: 5000, status: "pending" });

  const itemSnapshot = getSheetSnapshot("OrderItem");
  itemSnapshot.assertRowExists({ id: 901, orderId: 901 });
  itemSnapshot.assertRowExists({ id: 902, orderId: 901 });
  itemSnapshot.assertRowEquals({ id: 901 }, { productId: 1, unitPrice: 3000 });
  itemSnapshot.assertRowEquals({ id: 902 }, { productId: 2, unitPrice: 2000 });

  resetSheet("Order", orderData);
  resetSheet("OrderItem", orderItemData);
}

function testNestedCreateOneToOne(client: GassmaClient) {
  client.sheets.User.create({
    data: {
      id: 901,
      email: "nested@test.com",
      name: "NestedUser",
      isActive: true,
      role: "user",
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
  client.sheets.Order.create({
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

function testNestedCreateSelfReferencing(client: GassmaClient) {
  client.sheets.Category.create({
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

export { testNestedCreate };
