import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { productData } from "../../consts/productData";

function testCreate() {
  const client = new GassmaClient();

  testCreateBasic(client);
  testCreateReturnValue(client);
  testCreateSelect(client);
  testCreateOmit(client);

  Logger.log("✅ testCreate: all passed");
}

function testCreateBasic(client: GassmaClient) {
  client.sheets.Product.create({
    data: {
      id: 999,
      name: "テスト商品",
      price: 1500,
      stock: 10,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowExists({ id: 999 });
  snapshot.assertRowEquals({ id: 999 }, { name: "テスト商品", price: 1500, stock: 10 });
  snapshot.assertCount(101);

  resetSheet("Product", productData);
}

function testCreateReturnValue(client: GassmaClient) {
  const result = client.sheets.Product.create({
    data: {
      id: 998,
      name: "戻り値テスト",
      price: 2000,
      stock: 5,
      status: "soldout",
      createdAt: new Date("2025-06-01T00:00:00"),
    },
  });

  assertEquals(result.id, 998, "create return id");
  assertEquals(result.name, "戻り値テスト", "create return name");
  assertEquals(result.price, 2000, "create return price");
  assertEquals(result.stock, 5, "create return stock");
  assertEquals(result.status, "soldout", "create return status");

  resetSheet("Product", productData);
}

function testCreateSelect(client: GassmaClient) {
  const result = client.sheets.Product.create({
    data: {
      id: 997,
      name: "selectテスト",
      price: 3000,
      stock: 20,
      status: "available",
      createdAt: new Date("2025-07-01T00:00:00"),
    },
    select: { id: true, name: true },
  });

  assertDeepEquals(Object.keys(result).sort(), ["id", "name"], "create select keys");
  assertEquals(result.id, 997, "create select id");
  assertEquals(result.name, "selectテスト", "create select name");

  resetSheet("Product", productData);
}

function testCreateOmit(client: GassmaClient) {
  const result = client.sheets.Product.create({
    data: {
      id: 996,
      name: "omitテスト",
      price: 4000,
      stock: 30,
      status: "discontinued",
      createdAt: new Date("2025-08-01T00:00:00"),
    },
    omit: { createdAt: true },
  });

  const keys = Object.keys(result);
  if (keys.indexOf("createdAt") !== -1) {
    throw new Error("create omit: createdAt should be omitted");
  }
  if (keys.indexOf("id") === -1) {
    throw new Error("create omit: id should be present");
  }

  resetSheet("Product", productData);
}

export { testCreate };
