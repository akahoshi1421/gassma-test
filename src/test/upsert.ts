import { testUpsert } from "./upsert/testUpsert";

function testUpsertAll() {
  testUpsert();

  Logger.log("🎉 All upsert tests passed!");
}

export { testUpsertAll };
