import { GassmaClient } from "../generated/gassma/gassmaClient";
import { testAutoincrementCounter } from "./autoincrement/testAutoincrementCounter";
import { testAutoincrementInTransaction } from "./autoincrement/testAutoincrementInTransaction";
import { testAutoincrementNotConfigured } from "./autoincrement/testAutoincrementNotConfigured";
import { withRestoredAutoincrement } from "./autoincrement/withRestoredAutoincrement";
import { resetSheet } from "../reset/resetSheet";
import { notificationData } from "../consts/notificationData";

// カウンタは ScriptProperties にあり resetSheet では戻らないため、
// エリア全体を withRestoredAutoincrement で挟んで実行前の値へ必ず戻す。
function testAutoincrementAll() {
  resetSheet("notifications", notificationData);
  const client = new GassmaClient();

  withRestoredAutoincrement(client.Notification, () => {
    testAutoincrementCounter(client);
    testAutoincrementNotConfigured();
    testAutoincrementInTransaction(client);
  });

  Logger.log("🎉 All autoincrement counter tests passed!");
}

export { testAutoincrementAll };
