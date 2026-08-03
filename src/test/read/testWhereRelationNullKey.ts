import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

// 親自身の結合キーが null のとき、関連レコードは 0 件として扱われる（本体 #210）。
// consts の TimeSlot: 1 = 09:00 / 2 = 13:00 / 3 = slotAt が null（被参照キー null の親）
// consts の Reservation: Alice(09:00) Bob(09:00) Carol(13:00)。TimeSlot 3 に紐づく予約は無い。
const SLOT_1_AT = new Date("2025-09-01T09:00:00");

function testWhereRelationNullKey() {
  const client = new GassmaClient();

  testSomeExcludesNullKeyParent(client);
  testNoneIncludesNullKeyParent(client);
  testNoneWithConditionIncludesNullKeyParent(client);
  testEveryIncludesNullKeyParent(client);

  Logger.log("✅ testWhereRelationNullKey: all passed");
}

function testSomeExcludesNullKeyParent(client: GassmaClient) {
  const slots = client.TimeSlot.findMany({
    where: { reservations: { some: {} } },
    orderBy: { id: "asc" },
  });

  // キーが null の 3 は関連 0 件なので some には含まれない
  assertDeepEquals(
    slots.map((slot) => slot.id),
    [1, 2],
    "null key parent: some excludes it",
  );
}

function testNoneIncludesNullKeyParent(client: GassmaClient) {
  const slots = client.TimeSlot.findMany({
    where: { reservations: { none: {} } },
    orderBy: { id: "asc" },
  });

  // 関連が 1 件も無い枠は 3 のみ（1 と 2 は予約を持つ）
  assertDeepEquals(
    slots.map((slot) => slot.id),
    [3],
    "null key parent: none includes it",
  );
}

function testNoneWithConditionIncludesNullKeyParent(client: GassmaClient) {
  const slots = client.TimeSlot.findMany({
    where: { reservations: { none: { guestName: "Alice" } } },
    orderBy: { id: "asc" },
  });

  // Alice を持つのは 1 のみ。2 は「持たない」、3 は「関連 0 件」で共に一致する
  assertDeepEquals(
    slots.map((slot) => slot.id),
    [2, 3],
    "null key parent: none with condition includes it",
  );
}

function testEveryIncludesNullKeyParent(client: GassmaClient) {
  const noneMatching = client.TimeSlot.findMany({
    where: { reservations: { every: { guestName: "Alice" } } },
    orderBy: { id: "asc" },
  });

  // 1 は Bob、2 は Carol を含むため不成立。3 は関連 0 件なので vacuous truth で成立
  assertDeepEquals(
    noneMatching.map((slot) => slot.id),
    [3],
    "null key parent: every is vacuously true for it",
  );

  const withRealMatch = client.TimeSlot.findMany({
    where: { reservations: { every: { slotAt: SLOT_1_AT } } },
    orderBy: { id: "asc" },
  });

  // 1 は全予約が 09:00 で成立。3 は vacuous truth。両者が同時に返ることを確認する
  assertDeepEquals(
    withRealMatch.map((slot) => slot.id),
    [1, 3],
    "null key parent: every keeps it alongside a genuinely matching parent",
  );
}

export { testWhereRelationNullKey };
