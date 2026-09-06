const fs = require("fs");
const vm = require("vm");

require("../exercise-registry.js");
global.window = {
  TreningsbuddyWorkoutCategories: require("../workout-categories.js"),
  TreningsbuddyExerciseRegistry: global.TreningsbuddyExerciseRegistry,
};
global.document = { addEventListener: (_event, callback) => callback() };

let source = fs.readFileSync("app.js", "utf8");
const marker = "      const filterData";
source = source.replace(
  marker,
  '      console.log(JSON.stringify(allNames)); throw new Error("__DONE__");\n' + marker,
);

try {
  vm.runInThisContext(source);
} catch (error) {
  if (error.message !== "__DONE__") throw error;
}
