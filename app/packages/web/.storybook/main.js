module.exports = {
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.txt$/i,
      use: 'raw-loader',
    })
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    })
    return config;
  },
  stories: [
    "../**/*.stories.@(ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    '@storybook/addon-knobs',
  ],
}
