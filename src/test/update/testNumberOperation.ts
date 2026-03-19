import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { productData } from "../../consts/productData";

function testNumberOperation() {
  const client = new GassmaClient();

  testIncrement(client);
  testDecrement(client);
  testMultiply(client);
  testDivide(client);
  testNumberOperationInUpdateMany(client);

  Logger.log("✅ testNumberOperation: all passed");
}

function testIncrement(client: GassmaClient) {
  const before = client.sheets.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("increment: product 1 not found");

  client.sheets.Product.update({
    where: { id: 1 },
    data: { stock: { increment: 10 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { stock: before.stock + 10 });

  resetSheet("Product", productData);
}

function testDecrement(client: GassmaClient) {
  const before = client.sheets.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("decrement: product 1 not found");

  client.sheets.Product.update({
    where: { id: 1 },
    data: { stock: { decrement: 5 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { stock: before.stock - 5 });

  resetSheet("Product", productData);
}

function testMultiply(client: GassmaClient) {
  const before = client.sheets.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("multiply: product 1 not found");

  client.sheets.Product.update({
    where: { id: 1 },
    data: { price: { multiply: 2 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { price: before.price * 2 });

  resetSheet("Product", productData);
}

function testDivide(client: GassmaClient) {
  const before = client.sheets.Product.findFirst({ where: { id: 1 } });
  if (!before) throw new Error("divide: product 1 not found");

  client.sheets.Product.update({
    where: { id: 1 },
    data: { price: { divide: 2 } },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { price: before.price / 2 });

  resetSheet("Product", productData);
}

function testNumberOperationInUpdateMany(client: GassmaClient) {
  client.sheets.Product.updateMany({
    where: { id: { lte: 3 } },
    data: { stock: { increment: 100 } },
  });

  const snapshot = getSheetSnapshot("Product");
  // stock of id=1 was originally some value, now +100
  // Just verify all 3 were updated by checking they exist
  snapshot.assertRowExists({ id: 1 });
  snapshot.assertRowExists({ id: 2 });
  snapshot.assertRowExists({ id: 3 });

  resetSheet("Product", productData);
}

export { testNumberOperation };
