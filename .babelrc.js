const env = process.env.NODE_ENV;

const pluginsCommon = [
  ["@babel/transform-runtime", {
    "regenerator": true
  }],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
];

const presetsCommon = [
  "@babel/preset-react",
  '@babel/preset-flow',
  ['@babel/preset-env', { modules: false }],
];

if (env === 'cjs' || env === 'esm') {
  module.exports = {
    plugins: [
      // keep the order as-is
      ["@babel/transform-runtime", {
        "regenerator": true
      }],
      ['flow-react-proptypes', {deadCode: true, useESModules: true}],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
    ],
    presets: presetsCommon,
  };
}

if (env === 'umd') {
  module.exports = {
    comments: false,
    plugins: pluginsCommon.concat([['transform-react-remove-prop-types', { removeImport: true }]]),
    presets: presetsCommon,
  };
}

if (env === 'development') {
  module.exports = {
    plugins: pluginsCommon,
    presets: presetsCommon,
  };
}
