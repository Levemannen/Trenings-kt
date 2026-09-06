const assert = require("node:assert/strict");

require("../exercise-registry.js");
const registry = global.TreningsbuddyExerciseRegistry;

const mergedNames = [
  ["Deadlift", "Markløft"],
  ["Romanian Deadlift", "Rumensk markløft"],
  ["Dumbbell Bench Press", "Benkpress med manualer"],
  ["Close Grip Bench Press", "Smal benkpress"],
  ["Leg Raises", "Liggende beinhev"],
  ["Shoulder Taps", "Planke med skulderberøring"],
  ["Swimmers", "Svømmeren"],
];

for (const [oldName, canonical] of mergedNames) {
  assert.equal(registry.canonicalName(oldName), canonical);
  assert.equal(registry.idForName(oldName), registry.idForName(canonical));
  assert.equal(registry.canonicalName(registry.canonicalName(oldName)), canonical);
}

assert.notEqual(registry.idForName("Benkpress"), registry.idForName("Benkpress med manualer"));
assert.equal(registry.familyFor("Benkpress"), registry.familyFor("Benkpress med manualer"));
assert.notEqual(registry.idForName("Hip Thrust"), registry.idForName("Hip Thrust (kroppsvekt)"));
assert.equal(registry.familyFor("Hip Thrust"), registry.familyFor("Hip Thrust (kroppsvekt)"));

assert.equal(registry.canonicalName("Rope Pushdown"), "Rope Pushdown");
assert.notEqual(registry.idForName("Rope Pushdown"), registry.idForName("Triceps Pushdown"));
assert.ok(registry.aliasesFor("Markløft").some(name => name.toLowerCase() === "deadlift"));

assert.equal(registry.customId("Min spesialøvelse"), registry.customId("Min spesialøvelse"));
assert.notEqual(registry.customId("Min spesialøvelse"), registry.customId("En annen øvelse"));

console.log("Øvelsesregister: alle tester bestått");
