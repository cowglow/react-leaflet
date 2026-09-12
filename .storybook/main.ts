import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../frontend/**/*.mdx", "../frontend/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: {
        docs: false,
      },
    },
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig, { configType }) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(viteConfig, {
      plugins: [tsconfigPaths()],
      // Published alongside the app at /visual-directory/storybook/ (see
      // deploy.yml's "Build Storybook" step) — `storybook dev` keeps serving from
      // root, so this only applies to the production build.
      base: configType === "PRODUCTION" ? "/visual-directory/storybook/" : viteConfig.base,
    });
  },
};
export default config;
