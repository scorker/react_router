import pluginModule from "../node_modules/jss-plugin-default-unit/dist/jss-plugin-default-unit.cjs.js";

const resolvedPlugin =
  (pluginModule as { default?: () => unknown }).default ??
  (pluginModule as unknown as () => unknown);

export default resolvedPlugin;
