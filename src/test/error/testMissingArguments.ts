import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { tagData } from "../../consts/tagData";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";

function testMissingArguments() {
  testUpdateWithoutWhereThrows();
  testUpdateEmptyWhereUpdatesFirstRow();
  testDeleteWithoutArgThrows();
  testGroupByWithoutByThrows();
  testUpsertWithoutCreateThrows();

  Logger.log("✅ testMissingArguments: all passed");
}

function captureError(fn: () => void, label: string): unknown {
  try {
    fn();
  } catch (e) {
    return e;
  }
  throw new Error(`${label}: expected to throw but did not`);
}

// where 省略は GassmaMissingArgumentError(where: {} とは区別される)
function testUpdateWithoutWhereThrows() {
  const rawClient = new Gassma.GassmaClient({ id: SPREADSHEET_ID_DB1 });
  const error = captureError(() => {
    // @ts-expect-error where 省略は型レベルで禁止
    rawClient.Tag.update({ data: { name: "NoWhereTag" } });
  }, "update without where");

  assertEquals(
    error instanceof Gassma.GassmaMissingArgumentError,
    true,
    "update without where instanceof Gassma.GassmaMissingArgumentError",
  );
  const message = error instanceof Error ? error.message : String(error);
  assertEquals(
    message.indexOf("Argument `where` is missing") !== -1,
    true,
    `update without where message: "${message}"`,
  );

  // throw 時にシートが変更されていないこと
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowEquals({ id: 1 }, { name: "JavaScript" });
  snapshot.assertRowNotExists({ name: "NoWhereTag" });
}

// where: {} は従来どおり先頭行更新
function testUpdateEmptyWhereUpdatesFirstRow() {
  const client = new GassmaClient();
  const updated = client.Tag.update({
    where: {},
    data: { name: "EmptyWhereFirstRow" },
  });

  assertEquals(updated !== null, true, "update empty where returns record");
  if (updated) {
    assertEquals(updated.id, 1, "update empty where updates first row id");
    assertEquals(
      updated.name,
      "EmptyWhereFirstRow",
      "update empty where returned name",
    );
  }

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowEquals({ id: 1 }, { name: "EmptyWhereFirstRow" });
  snapshot.assertRowEquals({ id: 2 }, { name: "TypeScript" });

  resetSheet("Tag", tagData);
}

// delete({}) は #161 で GassmaMissingArgumentError 化。
// #161 前は先頭行を暗黙削除していたため、throw + シート無変更をピン留めして回帰を防ぐ。
function testDeleteWithoutArgThrows() {
  const rawClient = new Gassma.GassmaClient({ id: SPREADSHEET_ID_DB1 });

  // before: 削除前のシート状態を記録
  const before = getSheetSnapshot("Tag");
  before.assertCount(30);
  before.assertRowEquals({ id: 1 }, { name: "JavaScript" });

  const error = captureError(() => {
    // @ts-expect-error where 省略は型レベルで禁止
    rawClient.Tag.delete({});
  }, "delete without where");

  assertEquals(
    error instanceof Gassma.GassmaMissingArgumentError,
    true,
    "delete without where instanceof Gassma.GassmaMissingArgumentError",
  );
  const message = error instanceof Error ? error.message : String(error);
  assertEquals(
    message.indexOf("Argument `where` is missing") !== -1,
    true,
    `delete without where message: "${message}"`,
  );

  // #161 前は先頭行(id:1)が消えていた。件数・先頭行がともに無変更であること。
  const after = getSheetSnapshot("Tag");
  after.assertCount(30);
  after.assertRowEquals({ id: 1 }, { name: "JavaScript" });
}

// groupBy の by 省略も必須引数ガード対象(by: [] の現挙動とは区別)
function testGroupByWithoutByThrows() {
  const rawClient = new Gassma.GassmaClient({ id: SPREADSHEET_ID_DB1 });
  const error = captureError(() => {
    // @ts-expect-error by 省略は型レベルで禁止
    rawClient.Tag.groupBy({});
  }, "groupBy without by");

  assertEquals(
    error instanceof Gassma.GassmaMissingArgumentError,
    true,
    "groupBy without by instanceof Gassma.GassmaMissingArgumentError",
  );
  const message = error instanceof Error ? error.message : String(error);
  assertEquals(
    message.indexOf("Argument `by` is missing") !== -1,
    true,
    `groupBy without by message: "${message}"`,
  );
}

// upsert の create 省略も必須引数ガード対象
function testUpsertWithoutCreateThrows() {
  const rawClient = new Gassma.GassmaClient({ id: SPREADSHEET_ID_DB1 });
  const error = captureError(() => {
    // @ts-expect-error create 省略は型レベルで禁止
    rawClient.Tag.upsert({ where: { id: 942 }, update: { name: "NoCreate" } });
  }, "upsert without create");

  assertEquals(
    error instanceof Gassma.GassmaMissingArgumentError,
    true,
    "upsert without create instanceof Gassma.GassmaMissingArgumentError",
  );
  const message = error instanceof Error ? error.message : String(error);
  assertEquals(
    message.indexOf("Argument `create` is missing") !== -1,
    true,
    `upsert without create message: "${message}"`,
  );

  // throw 時に create 対象行(id:942)が作られていないこと
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowNotExists({ id: 942 });
}

export { testMissingArguments };
