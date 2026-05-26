import pluginModule from "../node_modules/jss-plugin-camel-case/dist/jss-plugin-camel-case.cjs.js";

const resolvedPlugin =
  (pluginModule as { default?: () => unknown }).default ??
  (pluginModule as unknown as () => unknown);

export default resolvedPlugin;
