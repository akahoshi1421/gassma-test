import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertThrows } from "../../assert/assertThrows";

function testErrorCases() {
  const client = new GassmaClient();

  testSelectOmitConflict(client);
  testSkipNegative(client);
  testLimitNegative(client);

  Logger.log("✅ testErrorCases: all passed");
}

function testSelectOmitConflict(client: GassmaClient) {
  // select と omit を同時に指定するとエラー
  assertThrows(
    () => {
      // @ts-expect-error select と omit の同時指定は型レベルで禁止
      client.sheets.User.findMany({
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
      client.sheets.User.findFirst({
        select: { id: true },
        omit: { name: true },
      });
    },
    "Cannot use both select and omit",
    "selectOmitConflict findFirst",
  );
}

function testSkipNegative(client: GassmaClient) {
  // skip に負数を指定するとエラー
  assertThrows(
    () => {
      client.sheets.User.findMany({
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
      client.sheets.User.updateMany({
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
      client.sheets.User.deleteMany({
        where: { id: 999 },
        limit: -1,
      });
    },
    "Invalid value for limit argument",
    "limitNegative deleteMany",
  );
}

export { testErrorCases };
