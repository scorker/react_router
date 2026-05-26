import pluginModule from "../node_modules/jss-plugin-props-sort/dist/jss-plugin-props-sort.cjs.js";

const resolvedPlugin =
  (pluginModule as { default?: () => unknown }).default ??
  (pluginModule as unknown as () => unknown);

export default resolvedPlugin;
