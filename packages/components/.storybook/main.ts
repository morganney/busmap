import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/story.tsx'],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-essentials'],
  /**
   * To use custom filenames for stories, I had to set this to `false`.
   * Otherwise, if you set it to `true` (the default) then the stories
   * must have a filename that includes `story|stories` or be inside a
   * directory named `story|stories`.
   *
   * @see https://github.com/storybookjs/storybook/issues/21414#issuecomment-1694357674
   */
  features: {
    storyStoreV7: false,
  },
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: '../ui/vite.config.ts',
      },
    },
  },
  async viteFinal(config) {
    return config
  },
}

export default config
