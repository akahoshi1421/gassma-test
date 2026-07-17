import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertThrows } from "../../assert/assertThrows";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";

function testErrorCases() {
  const client = new GassmaClient();

  testSelectOmitConflict(client);
  testWriteSelectOmitConflict(client);
  testSkipNegative(client);
  testLimitNegative(client);

  Logger.log("✅ testErrorCases: all passed");
}

function testSelectOmitConflict(client: GassmaClient) {
  // select と omit を同時に指定するとエラー
  assertThrows(
    () => {
      // @ts-expect-error select と omit の同時指定は型レベルで禁止
      client.User.findMany({
        select: { id: true, name: true },
        omit: { age: true },
      });
    },
    "Cannot use both select and omit",
    "selectOmitConflict findMany",
  );

  assertThrows(
    () => {
      // @ts-expect-error select と omit の同時指定は型レベルで禁止
      client.User.findFirst({
        select: { id: true },
        omit: { name: true },
      });
    },
    "Cannot use both select and omit",
    "selectOmitConflict findFirst",
  );
}

function testWriteSelectOmitConflict(client: GassmaClient) {
  // write 系（create/update/upsert/delete）でも select と omit の同時指定はエラー
  assertThrows(
    () => {
      // @ts-expect-error select と omit の同時指定は型レベルで禁止
      client.Tag.create({
        data: { id: 942, name: "ConflictCreate" },
        select: { id: true },
        omit: { name: true },
      });
    },
    "Cannot use both select and omit",
    "selectOmitConflict create",
  );

  assertThrows(
    () => {
      // @ts-expect-error select と omit の同時指定は型レベルで禁止
      client.Tag.update({
        where: { id: 1 },
        data: { name: "ConflictUpdate" },
        select: { id: true },
        omit: { name: true },
      });
    },
    "Cannot use both select and omit",
    "selectOmitConflict update",
  );

  assertThrows(
    () => {
      // @ts-expect-error select と omit の同時指定は型レベルで禁止
      client.Tag.upsert({
        where: { id: 942 },
        create: { id: 942, name: "ConflictUpsert" },
        update: { name: "ConflictUpsert" },
        select: { id: true },
        omit: { name: true },
      });
    },
    "Cannot use both select and omit",
    "selectOmitConflict upsert",
  );

  assertThrows(
    () => {
      // @ts-expect-error select と omit の同時指定は型レベルで禁止
      client.Tag.delete({
        where: { id: 1 },
        select: { id: true },
        omit: { name: true },
      });
    },
    "Cannot use both select and omit",
    "selectOmitConflict delete",
  );

  // throw 時にシートが変更されていないこと
  const snapshot = getSheetSnapshot("Tag");
  snapshot.assertRowNotExists({ id: 942 });
  snapshot.assertRowEquals({ id: 1 }, { name: "JavaScript" });
  snapshot.assertCount(30);
}

function testSkipNegative(client: GassmaClient) {
  // skip に負数を指定するとエラー
  assertThrows(
    () => {
      client.User.findMany({
        skip: -1,
      });
    },
    "Invalid value for skip argument",
    "skipNegative findMany",
  );

}

function testLimitNegative(client: GassmaClient) {
  // updateMany の limit に負数を指定するとエラー
  assertThrows(
    () => {
      client.User.updateMany({
        where: { id: 1 },
        data: { name: "test" },
        limit: -1,
      });
    },
    "Invalid value for limit argument",
    "limitNegative updateMany",
  );

  // deleteMany の limit に負数を指定するとエラー
  assertThrows(
    () => {
      client.User.deleteMany({
        where: { id: 999 },
        limit: -1,
      });
    },
    "Invalid value for limit argument",
    "limitNegative deleteMany",
  );
}

export { testErrorCases };
