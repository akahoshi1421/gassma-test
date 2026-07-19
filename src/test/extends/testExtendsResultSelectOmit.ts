import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultSelectOmit() {
  const client = new GassmaClient();

  const extended = client.$extends({
    result: {
      User: {
        greeting: {
          needs: { name: true },
          compute: (user) => `Hi ${user.name}`,
        },
      },
    },
  });

  const selected = extended.User.findFirst({
    where: { id: 1 },
    select: { id: true, greeting: true },
  });
  if (!selected) {
    throw new Error("extends resultSelectOmit: selected user not found");
  }
  assertEquals(selected.id, 1, "extends resultSelectOmit: selected id");
  assertEquals(selected.greeting, "Hi Chris Jackson", "extends resultSelectOmit: selected greeting");
  assertEquals("name" in selected, false, "extends resultSelectOmit: needs key not in output");
  assertEquals(Object.keys(selected).length, 2, "extends resultSelectOmit: only selected keys");

  const withoutComputed = extended.User.findFirst({
    where: { id: 1 },
    select: { id: true },
  });
  if (!withoutComputed) {
    throw new Error("extends resultSelectOmit: withoutComputed user not found");
  }
  assertEquals("greeting" in withoutComputed, false, "extends resultSelectOmit: unselected computed absent");

  const omitComputed = extended.User.findFirst({
    where: { id: 1 },
    omit: { greeting: true },
  });
  if (!omitComputed) {
    throw new Error("extends resultSelectOmit: omitComputed user not found");
  }
  assertEquals("greeting" in omitComputed, false, "extends resultSelectOmit: omitted computed absent");
  assertEquals(omitComputed.name, "Chris Jackson", "extends resultSelectOmit: base field kept");

  const omitNeeds = extended.User.findFirst({
    where: { id: 1 },
    omit: { name: true },
  });
  if (!omitNeeds) {
    throw new Error("extends resultSelectOmit: omitNeeds user not found");
  }
  assertEquals(omitNeeds.greeting, "Hi Chris Jackson", "extends resultSelectOmit: computed despite omitted needs");
  assertEquals("name" in omitNeeds, false, "extends resultSelectOmit: omitted needs key absent");

  Logger.log("✅ testExtendsResultSelectOmit: all passed");
}

export { testExtendsResultSelectOmit };
