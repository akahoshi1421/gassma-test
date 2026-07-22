import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

// TimeSlot.slotAt と Reservation.slotAt は別セルから独立にパースされる Date インスタンス。
// 参照比較ではなく時刻一致でリレーションが解決されることを検証する（本体 #159）。
const SLOT_1_AT = new Date("2025-09-01T09:00:00");

function testDateKeyRelation() {
  const client = new GassmaClient();

  testIncludeManyToOneByInstant(client);
  testIncludeOneToManyByInstantWithCount(client);
  testWhereRelationIsFilterByInstant(client);
  testRelationOrderByInstant(client);
  testRelationCountOrderByInstant(client);

  Logger.log("✅ testDateKeyRelation: all passed");
}

function testIncludeManyToOneByInstant(client: GassmaClient) {
  const reservations = client.Reservation.findMany({
    orderBy: { id: "asc" },
    include: { timeSlot: true },
  });

  assertEquals(reservations.length, 3, "include manyToOne by instant: reservation count");
  assertEquals(reservations[0].timeSlot?.id, 1, "include manyToOne by instant: Alice -> TimeSlot 1");
  assertEquals(reservations[1].timeSlot?.id, 1, "include manyToOne by instant: Bob -> TimeSlot 1");
  assertEquals(reservations[2].timeSlot?.id, 2, "include manyToOne by instant: Carol -> TimeSlot 2");
}

function testIncludeOneToManyByInstantWithCount(client: GassmaClient) {
  const slots = client.TimeSlot.findMany({
    orderBy: { id: "asc" },
    include: {
      reservations: true,
      _count: { select: { reservations: true } },
    },
  });

  assertEquals(slots.length, 2, "include oneToMany by instant: slot count");
  assertEquals(slots[0].reservations.length, 2, "include oneToMany by instant: slot1 reservations");
  assertEquals(slots[0]._count.reservations, 2, "include oneToMany by instant: slot1 _count");
  assertEquals(slots[1].reservations.length, 1, "include oneToMany by instant: slot2 reservations");
  assertEquals(slots[1]._count.reservations, 1, "include oneToMany by instant: slot2 _count");
}

function testWhereRelationIsFilterByInstant(client: GassmaClient) {
  const reservations = client.Reservation.findMany({
    where: { timeSlot: { is: { slotAt: SLOT_1_AT } } },
    orderBy: { id: "asc" },
  });

  assertDeepEquals(
    reservations.map((r) => r.id),
    [1, 2],
    "where relation is filter by instant: matches TimeSlot 1's reservations",
  );
}

function testRelationOrderByInstant(client: GassmaClient) {
  // Reservation を timeSlot.slotAt の降順でソート（manyToOne 先の DateTime フィールドソート）
  // 自然な id 順(1,2,3)とは異なる並びになるため、実際に並び替えが起きたことを検証できる
  const reservations = client.Reservation.findMany({
    orderBy: { timeSlot: { slotAt: "desc" } },
  });

  assertDeepEquals(
    reservations.map((r) => r.id),
    [3, 1, 2],
    "relation orderBy by instant: desc order (Carol's later slot first)",
  );
}

function testRelationCountOrderByInstant(client: GassmaClient) {
  // TimeSlot を reservations の _count 降順でソート（子の DateTime FK を時刻一致で集計）
  const slots = client.TimeSlot.findMany({
    orderBy: { reservations: { _count: "desc" } },
  });

  assertDeepEquals(
    slots.map((s) => s.id),
    [1, 2],
    "relation count orderBy by instant: slot1 (2 reservations) before slot2 (1)",
  );
}

export { testDateKeyRelation };
