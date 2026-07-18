import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

// Order id 6 の createdAt と同時刻（シート上に実在するセル時刻）を境界にする
const BOUNDARY = new Date("2025-05-19T06:51:24");

function testDateFilter() {
  const client = new GassmaClient();

  testDateCellPrecondition(client);
  testDateGt(client);
  testDateGte(client);
  testDateLt(client);
  testDateLte(client);
  testDateRangePinpoint(client);
  testDateEqualsNeverMatches(client);
  testDateInNotIn(client);

  Logger.log("✅ testDateFilter: all passed");
}

// 前提: createdAt が datetime セルで、スクリプトとシートのタイムゾーンが一致していること
function testDateCellPrecondition(client: GassmaClient) {
  const order = client.Order.findFirstOrThrow({ where: { id: 6 } });
  if (!(order.createdAt instanceof Date)) {
    throw new Error(
      `date precondition: createdAt cell must be a datetime cell, got ${typeof order.createdAt}`,
    );
  }
  assertEquals(
    order.createdAt.getTime(),
    BOUNDARY.getTime(),
    "date precondition: cell instant equals boundary",
  );
}

function testDateGt(client: GassmaClient) {
  const orders = client.Order.findMany({
    where: { createdAt: { gt: BOUNDARY } },
  });
  assertEquals(orders.length, 64, "date gt: count");
  orders.forEach((order) => {
    if (order.createdAt.getTime() <= BOUNDARY.getTime()) {
      throw new Error(`date gt: id ${order.id} is not after boundary`);
    }
  });
}

function testDateGte(client: GassmaClient) {
  const orders = client.Order.findMany({
    where: { createdAt: { gte: BOUNDARY } },
  });
  // gt 64 件 + 境界と同時刻の id 6 の 1 件
  assertEquals(orders.length, 65, "date gte: count");
  assertEquals(
    orders.some((order) => order.id === 6),
    true,
    "date gte: boundary row included",
  );
}

function testDateLt(client: GassmaClient) {
  const orders = client.Order.findMany({
    where: { createdAt: { lt: BOUNDARY } },
  });
  assertEquals(orders.length, 235, "date lt: count");
  orders.forEach((order) => {
    if (order.createdAt.getTime() >= BOUNDARY.getTime()) {
      throw new Error(`date lt: id ${order.id} is not before boundary`);
    }
  });
}

function testDateLte(client: GassmaClient) {
  const orders = client.Order.findMany({
    where: { createdAt: { lte: BOUNDARY } },
  });
  assertEquals(orders.length, 236, "date lte: count");
  assertEquals(
    orders.some((order) => order.id === 6),
    true,
    "date lte: boundary row included",
  );
}

function testDateRangePinpoint(client: GassmaClient) {
  // gte + lte の同値サンドで同時刻セルを数値比較として特定できる
  const orders = client.Order.findMany({
    where: { createdAt: { gte: BOUNDARY, lte: BOUNDARY } },
  });
  assertDeepEquals(
    orders.map((order) => order.id),
    [6],
    "date range pinpoint: ids",
  );
}

function testDateEqualsNeverMatches(client: GassmaClient) {
  // equals / 直値は === の参照比較のため、同時刻セルが存在しても Date は 0 件（仕様固定）
  const byEquals = client.Order.findMany({
    where: { createdAt: { equals: BOUNDARY } },
  });
  assertEquals(byEquals.length, 0, "date equals: reference comparison matches nothing");

  const byDirect = client.Order.findMany({
    where: { createdAt: BOUNDARY },
  });
  assertEquals(byDirect.length, 0, "date direct value: reference comparison matches nothing");
}

function testDateInNotIn(client: GassmaClient) {
  // in / notIn も includes の参照比較（仕様固定）: in は 0 件、notIn は非 null 全件
  const byIn = client.Order.findMany({
    where: { createdAt: { in: [BOUNDARY] } },
  });
  assertEquals(byIn.length, 0, "date in: reference comparison matches nothing");

  const byNotIn = client.Order.findMany({
    where: { createdAt: { notIn: [BOUNDARY] } },
  });
  assertEquals(byNotIn.length, 300, "date notIn: matches all non-null rows");
}

export { testDateFilter };
