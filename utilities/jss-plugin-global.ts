import pluginModule from "../node_modules/jss-plugin-global/dist/jss-plugin-global.cjs.js";

const resolvedPlugin =
  (pluginModule as { default?: () => unknown }).default ??
  (pluginModule as unknown as () => unknown);

export default resolvedPlugin;
