const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;

const sdkPackages = path.resolve(
  projectRoot,
  "../userflow-official-repos/userflow-react-native/packages",
);

const SINGLETON_MODULES = [
  "react",
  "react-native",
  "expo",
  "expo-router",
  "react-native-safe-area-context",
  "react-native-screens",
  "react-native-gesture-handler",
  "@react-navigation/native",
  "@react-navigation/core",
];

function isSingletonModule(moduleName) {
  return SINGLETON_MODULES.some(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  );
}

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Watch the SDK packages (symlinked via file:)
config.watchFolders = [...(config.watchFolders ?? []), sdkPackages];

config.resolver = {
  ...config.resolver,
  unstable_enableSymlinks: true,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    "@userflow/protocol": path.join(sdkPackages, "protocol"),
    "@userflow/core": path.join(sdkPackages, "core"),
    "@userflow/react-native": path.join(sdkPackages, "react-native"),
  },
};

const originalResolveRequest = config.resolver.resolveRequest;

function isBareSpecifier(moduleName) {
  return !moduleName.startsWith(".") && !path.isAbsolute(moduleName);
}

const stubbed = new Set();

function warnStubbed(moduleName) {
  if (stubbed.has(moduleName)) return;
  stubbed.add(moduleName);
  console.warn(
    `[metro] stubbing optional Userflow peer "${moduleName}" — not installed in this app`,
  );
}

// Re-run Metro's own resolver as if the request came from this app, so platform
// extensions and package "exports" are still honoured.
function resolveFromApp(context, moduleName, platform) {
  return context.resolveRequest(
    { ...context, originModulePath: path.join(projectRoot, "index.js") },
    moduleName,
    platform,
  );
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force @userflow/react-native to pre-built CJS, not src/index.ts
  if (moduleName === "@userflow/react-native") {
    return {
      type: "sourceFile",
      filePath: path.join(sdkPackages, "react-native/lib/commonjs/index.js"),
    };
  }
  // Pin peer deps to THIS app's node_modules (from docs/metro.md)
  if (isSingletonModule(moduleName)) {
    try {
      return {
        type: "sourceFile",
        filePath: require.resolve(moduleName, { paths: [projectRoot] }),
      };
    } catch {
      // fall through
    }
  }
  // The SDK is linked from outside projectRoot, so its own node_modules are
  // pnpm symlinks pointing outside Metro's watched roots — unresolvable, and a
  // second copy of a native module (async-storage) even when they do resolve.
  // Serve every bare dependency the SDK asks for from this app's node_modules.
  if (
    isBareSpecifier(moduleName) &&
    !moduleName.startsWith("@userflow/") &&
    context.originModulePath?.startsWith(sdkPackages)
  ) {
    try {
      return resolveFromApp(context, moduleName, platform);
    } catch {
      // Optional peers (expo-router, @react-navigation/native) that this app
      // does not install. The SDK feature-detects them at runtime, but Metro
      // still walks the static require, so hand it an empty module.
      warnStubbed(moduleName);
      return { type: "empty" };
    }
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
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
