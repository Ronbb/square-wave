module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: '8.0',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['babel-plugin-import', {
      libraryName: 'antd',
      libraryDirectory: 'lib'
    }]
  ],
}
