const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const userflowSdkRoot = path.resolve(projectRoot, "../userflow-react-native");

const SINGLETON_MODULES = [
  "react",
  "react-native",
  "expo",
  "react-native-safe-area-context",
  "react-native-screens",
  "react-native-gesture-handler",
  "@react-native-async-storage/async-storage",
  "@react-native-community/netinfo",
];

function isSingletonModule(moduleName) {
  return SINGLETON_MODULES.some(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  );
}

const ROUTER_MODULES = ["expo-router", "@react-navigation/native"];

const ROUTER_STUB = path.resolve(projectRoot, "userflow-expo-router-stub.js");

function isRouterModule(moduleName) {
  return ROUTER_MODULES.some(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  );
}

const config = getDefaultConfig(projectRoot);

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: { keep_classnames: true, keep_fnames: true },
  },
};

config.watchFolders = [...(config.watchFolders ?? []), userflowSdkRoot];

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (isRouterModule(moduleName)) {
    return { type: "sourceFile", filePath: ROUTER_STUB };
  }

  if (isSingletonModule(moduleName)) {
    try {
      return {
        type: "sourceFile",
        filePath: require.resolve(moduleName, { paths: [projectRoot] }),
      };
    } catch {
      // Fall through to Metro's default resolver.
    }
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
