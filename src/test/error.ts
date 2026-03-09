import { testErrorCases } from "./error/testErrorCases";

function testErrorAll() {
  testErrorCases();

  Logger.log("🎉 All error tests passed!");
}

export { testErrorAll };
