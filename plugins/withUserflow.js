// @userflow-tech/react-native@0.1.1 ships app.plugin.js but its package.json
// "exports" map doesn't list it, so `require("@userflow-tech/react-native/app.plugin.js")`
// fails with ERR_PACKAGE_PATH_NOT_EXPORTED. Reaching it via an absolute path
// instead of a package specifier bypasses that restriction.
const path = require("path");

const pkgRoot = path.dirname(
  require.resolve("@userflow-tech/react-native/package.json"),
);

module.exports = require(path.join(pkgRoot, "app.plugin.js"));
