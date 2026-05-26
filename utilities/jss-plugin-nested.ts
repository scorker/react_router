import pluginModule from "../node_modules/jss-plugin-nested/dist/jss-plugin-nested.cjs.js";

const resolvedPlugin =
  (pluginModule as { default?: () => unknown }).default ??
  (pluginModule as unknown as () => unknown);

export default resolvedPlugin;
