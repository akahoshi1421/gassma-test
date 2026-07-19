import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { getSheetSnapshotWithOffset } from "../../assert/getSheetSnapshotWithOffset";
import { resetSheet } from "../../reset/resetSheet";
import { resetSheetWithOffset } from "../../reset/resetSheetWithOffset";
import {
  offsetNoteData,
  OFFSET_NOTE_START_ROW,
  OFFSET_NOTE_START_COLUMN,
  OFFSET_NOTE_END_COLUMN,
} from "../../consts/offsetNoteData";
import { tagData } from "../../consts/tagData";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";

function testChangeSettings() {
  const client = new GassmaClient();
  client.OffsetNote.changeSettings(OFFSET_NOTE_START_ROW, "B", "D");

  testChangeSettingsFindMany(client);
  testChangeSettingsFindManyWhere(client);
  testChangeSettingsFindFirst(client);
  testChangeSettingsColumnLetterEquivalence(client);
  testChangeSettingsCreate();
  testChangeSettingsUpdate(client);
  testChangeSettingsDelete(client);
  testChangeSettingsOtherSheetsUnaffected(client);

  Logger.log("✅ testChangeSettings: all passed");
}

function resetOffsetNote() {
  resetSheetWithOffset(
    "OffsetNote",
    offsetNoteData,
    OFFSET_NOTE_START_ROW,
    OFFSET_NOTE_START_COLUMN,
  );
}

function getOffsetNoteSnapshot() {
  return getSheetSnapshotWithOffset(
    "OffsetNote",
    OFFSET_NOTE_START_ROW,
    OFFSET_NOTE_START_COLUMN,
  );
}

function testChangeSettingsFindMany(client: GassmaClient) {
  const notes = client.OffsetNote.findMany({});
  assertEquals(notes.length, 5, "changeSettings findMany count");
  assertDeepEquals(
    notes.map((note) => note.id),
    [1, 2, 3, 4, 5],
    "changeSettings findMany ids",
  );
  assertDeepEquals(
    notes[0],
    { id: 1, title: "alpha", value: 10 },
    "changeSettings findMany first record",
  );
}

function testChangeSettingsFindManyWhere(client: GassmaClient) {
  const matched = client.OffsetNote.findMany({ where: { value: { gte: 30 } } });
  assertDeepEquals(
    matched.map((note) => note.id),
    [3, 4, 5],
    "changeSettings findMany where ids",
  );
}

function testChangeSettingsFindFirst(client: GassmaClient) {
  const note = client.OffsetNote.findFirst({ where: { title: "gamma" } });
  assertEquals(note !== null, true, "changeSettings findFirst found");
  if (note) {
    assertEquals(note.id, 3, "changeSettings findFirst id");
    assertEquals(note.value, 30, "changeSettings findFirst value");
  }
}

// 同じ範囲を数値指定と列文字指定("B" = 2)で設定しても同結果になること
function testChangeSettingsColumnLetterEquivalence(client: GassmaClient) {
  client.OffsetNote.changeSettings(
    OFFSET_NOTE_START_ROW,
    OFFSET_NOTE_START_COLUMN,
    OFFSET_NOTE_END_COLUMN,
  );
  const byNumber = client.OffsetNote.findMany({});
  assertEquals(byNumber.length, 5, "changeSettings number form count");
  assertDeepEquals(
    byNumber[0],
    { id: 1, title: "alpha", value: 10 },
    "changeSettings number form first record",
  );

  client.OffsetNote.changeSettings(OFFSET_NOTE_START_ROW, "B", "D");
  const byLetter = client.OffsetNote.findMany({});
  assertDeepEquals(
    byLetter,
    byNumber,
    "changeSettings letter form equals number form",
  );

  client.OffsetNote.changeSettings(
    OFFSET_NOTE_START_ROW,
    OFFSET_NOTE_START_COLUMN,
    "D",
  );
  const byMixed = client.OffsetNote.findMany({});
  assertDeepEquals(
    byMixed,
    byNumber,
    "changeSettings mixed number/letter equals number form",
  );
}

function testChangeSettingsCreate() {
  const client = new GassmaClient();
  client.OffsetNote.changeSettings(
    OFFSET_NOTE_START_ROW,
    OFFSET_NOTE_START_COLUMN,
    OFFSET_NOTE_END_COLUMN,
  );

  const result = client.OffsetNote.create({
    data: { id: 6, title: "zeta", value: 60 },
  });
  assertEquals(result.id, 6, "changeSettings create return id");
  assertEquals(result.title, "zeta", "changeSettings create return title");

  const snapshot = getOffsetNoteSnapshot();
  snapshot.assertCount(6);
  snapshot.assertRowEquals({ id: 6 }, { title: "zeta", value: 60 });

  assertCreatedCellPositions();

  resetOffsetNote();
}

// 新規行が B10:D10 に書かれ、A列・1〜3行目が空のままであることを実セルで検証
function assertCreatedCellPositions() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID_DB1).getSheetByName("OffsetNote");
  if (!sheet) throw new Error("OffsetNote sheet not found");

  assertEquals(sheet.getLastRow(), 10, "changeSettings create last row");
  assertDeepEquals(
    sheet.getRange(10, 1, 1, 4).getValues()[0],
    ["", 6, "zeta", 60],
    "changeSettings create written cells",
  );

  const topRows = sheet.getRange(1, 1, 3, 4).getValues();
  topRows.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      assertEquals(
        String(cell),
        "",
        `changeSettings create empty cell r${rowIndex + 1}c${columnIndex + 1}`,
      );
    });
  });
}

function testChangeSettingsUpdate(client: GassmaClient) {
  const result = client.OffsetNote.update({
    where: { id: 2 },
    data: { value: 25 },
  });
  assertEquals(result !== null, true, "changeSettings update return not null");

  const snapshot = getOffsetNoteSnapshot();
  snapshot.assertCount(5);
  snapshot.assertRowEquals({ id: 2 }, { title: "beta", value: 25 });
  snapshot.assertRowEquals({ id: 1 }, { title: "alpha", value: 10 });
  snapshot.assertRowEquals({ id: 3 }, { title: "gamma", value: 30 });

  resetOffsetNote();
}

function testChangeSettingsDelete(client: GassmaClient) {
  const result = client.OffsetNote.delete({ where: { id: 4 } });
  assertEquals(result !== null, true, "changeSettings delete return not null");

  const snapshot = getOffsetNoteSnapshot();
  snapshot.assertCount(4);
  snapshot.assertRowNotExists({ id: 4 });
  snapshot.assertRowEquals({ id: 3 }, { title: "gamma", value: 30 });
  snapshot.assertRowEquals({ id: 5 }, { title: "epsilon", value: 50 });

  const remaining = client.OffsetNote.findMany({});
  assertDeepEquals(
    remaining.map((note) => note.id),
    [1, 2, 3, 5],
    "changeSettings delete remaining ids",
  );

  resetOffsetNote();
}

function testChangeSettingsOtherSheetsUnaffected(client: GassmaClient) {
  const tags = client.Tag.findMany({});
  assertEquals(tags.length, 30, "changeSettings other sheet findMany count");

  const tag = client.Tag.findFirst({ where: { id: 1 } });
  assertEquals(tag !== null, true, "changeSettings other sheet findFirst found");
  if (tag) {
    assertEquals(tag.name, "JavaScript", "changeSettings other sheet findFirst name");
  }

  client.Tag.create({ data: { id: 901, name: "offsetGuard" } });
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(31);
  snapshot.assertRowEquals({ id: 901 }, { name: "offsetGuard" });

  resetSheet("Tag", tagData);
}

export { testChangeSettings };
