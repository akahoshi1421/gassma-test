import { testInjection } from "./security/testInjection";

function testSecurityAll() {
  testInjection();

  Logger.log("🎉 All security tests passed!");
}

export { testSecurityAll };
