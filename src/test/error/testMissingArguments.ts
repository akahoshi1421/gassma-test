import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { SPREADSHEET_ID_DB1 } from "../../consts/spreadsheetIds";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";

function testMissingArguments() {
  testUpdateWithoutWhereThrows();
  testUpdateEmptyWhereThrows();
  testDeleteAndUpsertEmptyWhereThrow();
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

// where 省略は GassmaMissingArgumentError(where: {} の GassmaInvalidValueError とは別クラス)
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

// where: {} は GassmaInvalidValueError(where 省略の GassmaMissingArgumentError とは別クラス)。
// 以前は先頭行を暗黙更新していたため、throw + シート無変更をピン留めして回帰を防ぐ。
function testUpdateEmptyWhereThrows() {
  const client = new GassmaClient();
  const error = captureError(() => {
    client.Tag.update({
      where: {},
      data: { name: "EmptyWhereFirstRow" },
    });
  }, "update empty where");

  assertEquals(
    error instanceof Gassma.GassmaInvalidValueError,
    true,
    "update empty where instanceof Gassma.GassmaInvalidValueError",
  );
  const message = error instanceof Error ? error.message : String(error);
  assertEquals(
    message.indexOf(
      "Invalid value for argument `where`. Expected at least one condition.",
    ) !== -1,
    true,
    `update empty where message: "${message}"`,
  );

  // 以前は id:1 が書き換わっていた。件数・先頭行がともに無変更であること
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowEquals({ id: 1 }, { name: "JavaScript" });
  snapshot.assertRowEquals({ id: 2 }, { name: "TypeScript" });
  snapshot.assertRowNotExists({ name: "EmptyWhereFirstRow" });
}

// delete / upsert の空 where も同じ扱い。シートが削除も作成もされないこと
function testDeleteAndUpsertEmptyWhereThrow() {
  const client = new GassmaClient();

  const deleteError = captureError(() => {
    client.Tag.delete({ where: {} });
  }, "delete empty where");
  assertEquals(
    deleteError instanceof Gassma.GassmaInvalidValueError,
    true,
    "delete empty where instanceof Gassma.GassmaInvalidValueError",
  );

  const upsertError = captureError(() => {
    client.Tag.upsert({
      where: {},
      update: { name: "EmptyWhereUpsert" },
      create: { name: "EmptyWhereUpsert" },
    });
  }, "upsert empty where");
  assertEquals(
    upsertError instanceof Gassma.GassmaInvalidValueError,
    true,
    "upsert empty where instanceof Gassma.GassmaInvalidValueError",
  );

  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertCount(30);
  snapshot.assertRowEquals({ id: 1 }, { name: "JavaScript" });
  snapshot.assertRowNotExists({ name: "EmptyWhereUpsert" });
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
