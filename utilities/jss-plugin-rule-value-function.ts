import pluginModule from "../node_modules/jss-plugin-rule-value-function/dist/jss-plugin-rule-value-function.cjs.js";

const resolvedPlugin =
  (pluginModule as { default?: () => unknown }).default ??
  (pluginModule as unknown as () => unknown);

export default resolvedPlugin;
