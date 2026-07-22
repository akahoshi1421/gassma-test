import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { timeSlotData } from "../../consts/timeSlotData";
import { reservationData } from "../../consts/reservationData";

// TimeSlot(id:1).slotAt の元インスタンス。Reservation(id:1,2) がこの時刻の FK を持つ
const ORIGINAL_SLOT_1_AT = new Date("2025-09-01T09:00:00");

function testOnUpdateDateKey() {
  const client = new GassmaClient();

  testOnUpdateDateKeySameInstantNoOp(client);
  testOnUpdateDateKeyDifferentInstantCascades(client);

  Logger.log("✅ testOnUpdateDateKey: all passed");
}

function resetDateKeySheets() {
  resetSheet("TimeSlot", timeSlotData);
  resetSheet("Reservation", reservationData);
}

function testOnUpdateDateKeySameInstantNoOp(client: GassmaClient) {
  // 同時刻・別インスタンスの Date で update → onUpdate: Cascade は発火しない
  // (before/after が isValueEqual で同一と判定され、変更なし扱いになる。本体 #159)
  client.TimeSlot.update({
    where: { id: 1 },
    data: { slotAt: new Date(ORIGINAL_SLOT_1_AT.getTime()) },
  });

  const reservations = client.Reservation.findMany({
    where: { id: { in: [1, 2] } },
    orderBy: { id: "asc" },
  });

  assertEquals(reservations.length, 2, "same-instant update: reservation count unchanged");
  reservations.forEach((r) => {
    assertEquals(
      r.slotAt.getTime(),
      ORIGINAL_SLOT_1_AT.getTime(),
      `same-instant update: reservation ${r.id} slotAt untouched`,
    );
  });

  // 時刻一致の where フィルタでも旧インスタンスのままの予約が引き続き見つかる
  const stillFound = client.Reservation.findMany({
    where: { slotAt: ORIGINAL_SLOT_1_AT },
  });
  assertEquals(stillFound.length, 2, "same-instant update: still findable by original instant");

  Logger.log("  same-instant update: Cascade did not fire (FK unchanged)");

  resetDateKeySheets();
}

function testOnUpdateDateKeyDifferentInstantCascades(client: GassmaClient) {
  // 対照実験: 異なる時刻への update では Cascade が正しく発火する
  const NEW_SLOT_AT = new Date("2025-09-01T10:30:00");

  client.TimeSlot.update({
    where: { id: 1 },
    data: { slotAt: NEW_SLOT_AT },
  });

  const reservations = client.Reservation.findMany({
    where: { id: { in: [1, 2] } },
    orderBy: { id: "asc" },
  });

  assertEquals(reservations.length, 2, "different-instant update: reservation count unchanged");
  reservations.forEach((r) => {
    assertEquals(
      r.slotAt.getTime(),
      NEW_SLOT_AT.getTime(),
      `different-instant update: reservation ${r.id} slotAt cascaded to new instant`,
    );
  });

  const oldInstantGone = client.Reservation.findMany({
    where: { slotAt: ORIGINAL_SLOT_1_AT },
  });
  assertEquals(oldInstantGone.length, 0, "different-instant update: old instant no longer matches");

  Logger.log("  different-instant update: Cascade fired (FK followed new instant)");

  resetDateKeySheets();
}

export { testOnUpdateDateKey };
