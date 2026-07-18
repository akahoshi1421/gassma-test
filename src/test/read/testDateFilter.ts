import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

// Order id 6 の createdAt と同時刻（シート上に実在するセル時刻）を境界にする
const BOUNDARY = new Date("2025-05-19T06:51:24");

// ライブラリ realm 由来の Date は instanceof Date に落ちるため toString で判定する
function isDateValue(value: unknown): value is Date {
  return (
    value instanceof Date ||
    Object.prototype.toString.call(value) === "[object Date]"
  );
}

function testDateFilter() {
  const client = new GassmaClient();

  testDateCellPrecondition(client);
  testDateGt(client);
  testDateGte(client);
  testDateLt(client);
  testDateLte(client);
  testDateRangePinpoint(client);
  testDateEqualsMatchesByInstant(client);
  testDateNotExcludesByInstant(client);
  testDateInNotIn(client);
  testDateIsoStringNeverMatches(client);

  Logger.log("✅ testDateFilter: all passed");
}

// 前提: createdAt が datetime セルで、スクリプトとシートのタイムゾーンが一致していること
function testDateCellPrecondition(client: GassmaClient) {
  const order = client.Order.findFirstOrThrow({ where: { id: 6 } });
  if (!isDateValue(order.createdAt)) {
    throw new Error(
      `date precondition: createdAt cell must be a datetime cell, got ${Object.prototype.toString.call(order.createdAt)}`,
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

function testDateEqualsMatchesByInstant(client: GassmaClient) {
  // equals / 直値は getTime の時刻一致で判定される（別インスタンスでも一致）
  const byEquals = client.Order.findMany({
    where: { createdAt: { equals: BOUNDARY } },
  });
  assertDeepEquals(
    byEquals.map((order) => order.id),
    [6],
    "date equals: same instant matches boundary row",
  );

  const byDirect = client.Order.findMany({
    where: { createdAt: BOUNDARY },
  });
  assertDeepEquals(
    byDirect.map((order) => order.id),
    [6],
    "date direct value: same instant matches boundary row",
  );

  const byPlus1ms = client.Order.findMany({
    where: { createdAt: { equals: new Date(BOUNDARY.getTime() + 1) } },
  });
  assertEquals(byPlus1ms.length, 0, "date equals: +1ms matches nothing");
}

function testDateNotExcludesByInstant(client: GassmaClient) {
  const orders = client.Order.findMany({
    where: { createdAt: { not: BOUNDARY } },
  });
  assertEquals(orders.length, 299, "date not: count");
  assertEquals(
    orders.some((order) => order.id === 6),
    false,
    "date not: boundary row excluded",
  );
}

function testDateInNotIn(client: GassmaClient) {
  const byIn = client.Order.findMany({
    where: { createdAt: { in: [BOUNDARY] } },
  });
  assertDeepEquals(
    byIn.map((order) => order.id),
    [6],
    "date in: same instant matches boundary row",
  );

  const byNotIn = client.Order.findMany({
    where: { createdAt: { notIn: [BOUNDARY] } },
  });
  assertEquals(byNotIn.length, 299, "date notIn: count");
  assertEquals(
    byNotIn.some((order) => order.id === 6),
    false,
    "date notIn: boundary row excluded",
  );
}

function testDateIsoStringNeverMatches(client: GassmaClient) {
  // ISO 文字列直値は Date セルと不一致（暗黙変換しない仕様固定）
  const orders = client.Order.findMany({
    // @ts-expect-error Date カラムへの文字列直値は型レベルで禁止
    where: { createdAt: "2025-05-19T06:51:24" },
  });
  assertEquals(orders.length, 0, "date ISO string direct value: matches nothing");
}

export { testDateFilter };
