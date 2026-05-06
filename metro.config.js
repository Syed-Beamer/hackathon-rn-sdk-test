// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const monorepoPackages = path.resolve(
  __dirname,
  "../userflow-react-native-sdk/packages"
);

// Watch the monorepo packages so Metro can serve their files across the symlink.
config.watchFolders = [
  ...(config.watchFolders ?? []),
  path.join(monorepoPackages, "react-native"),
  path.join(monorepoPackages, "core"),
  path.join(monorepoPackages, "protocol"),
];

config.resolver = {
  ...config.resolver,
  unstable_enableSymlinks: true,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    // Pin React / React Native to this project's copies.
    react: path.resolve(__dirname, "node_modules/react"),
    "react-native": path.resolve(__dirname, "node_modules/react-native"),
    // Map monorepo workspace packages to their pre-built dist/lib outputs so
    // Metro never tries to resolve workspace:* dependencies.
    "@userflow/core": path.join(monorepoPackages, "core"),
    "@userflow/protocol": path.join(monorepoPackages, "protocol"),
    "@userflow/react-native": path.join(monorepoPackages, "react-native"),
    // The SDK's CJS bundle does require('react-native-view-shot') at runtime.
    // Because Metro loads the bundle from the monorepo path, Node resolution
    // would look there first — but the package is only installed here.
    "react-native-view-shot": path.resolve(
      __dirname,
      "node_modules/react-native-view-shot"
    ),
  },
  resolveRequest: (context, moduleName, platform) => {
    // Force @userflow/react-native to the pre-built CJS entry so Metro doesn't
    // follow the "react-native": "src/index.ts" field and pull in TypeScript
    // source that imports workspace-only packages.
    if (moduleName === "@userflow/react-native") {
      return {
        filePath: path.join(
          monorepoPackages,
          "react-native/lib/commonjs/index.js"
        ),
        type: "sourceFile",
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer?.minifierConfig,
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      ...config.transformer?.minifierConfig?.mangle,
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

module.exports = config;
