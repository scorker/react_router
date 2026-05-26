import pluginModule from "../node_modules/jss-plugin-vendor-prefixer/dist/jss-plugin-vendor-prefixer.cjs.js";

const resolvedPlugin =
  (pluginModule as { default?: () => unknown }).default ??
  (pluginModule as unknown as () => unknown);

export default resolvedPlugin;
