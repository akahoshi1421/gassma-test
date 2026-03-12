import { GassmaClient } from "../../generated/gassma/testClient";
import { assertEquals } from "../../assert/assertEquals";

function testMap() {
  testMapFindFirst();
  testMapFindMany();
  testMapWhere();
  testMapSelect();

  Logger.log("✅ testMap: all passed");
}

function testMapFindFirst() {
  // @map("total_amount") により、コード上は totalAmount でアクセスできる
  const client = new GassmaClient();

  const order = client.sheets.Order.findFirst({ where: { id: 1 } });
  if (!order) throw new Error("map findFirst: got null");

  const keys = Object.keys(order);
  if (keys.indexOf("totalAmount") === -1) {
    throw new Error("map findFirst: totalAmount should be present (mapped from total_amount)");
  }
  if (keys.indexOf("total_amount") !== -1) {
    throw new Error("map findFirst: total_amount should not appear as key");
  }
  assertEquals(order.totalAmount, 39478, "map findFirst: totalAmount value");
}

function testMapFindMany() {
  const client = new GassmaClient();

  const orders = client.sheets.Order.findMany({ where: { id: { in: [1, 2] } } });
  assertEquals(orders.length, 2, "map findMany: count");

  assertEquals(orders[0].totalAmount, 39478, "map findMany: first totalAmount");
  assertEquals(orders[1].totalAmount, 20296, "map findMany: second totalAmount");
}

function testMapWhere() {
  // totalAmount（コード名）で where 検索できる
  const client = new GassmaClient();

  const orders = client.sheets.Order.findMany({
    where: { totalAmount: 39478 },
  });
  assertEquals(orders.length, 1, "map where: count");
  assertEquals(orders[0].id, 1, "map where: matched id");
}

function testMapSelect() {
  // select でも totalAmount（コード名）で指定できる
  const client = new GassmaClient();

  const order = client.sheets.Order.findFirst({
    where: { id: 1 },
    select: { id: true, totalAmount: true },
  });
  if (!order) throw new Error("map select: got null");

  assertEquals(order.id, 1, "map select: id");
  assertEquals(order.totalAmount, 39478, "map select: totalAmount");
}

export { testMap };
