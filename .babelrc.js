const env = process.env.NODE_ENV;

const presetsCommon = [
  "@babel/preset-react",
  '@babel/preset-flow',
  ['@babel/preset-env', { modules: env === 'commonjs' ? 'commonjs' : false }],
];

if (env === 'commonjs' || env === 'esm') {
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

if (env === 'rollup') {
  module.exports = {
    comments: false,
    plugins: [
      ["@babel/transform-runtime", {
        "regenerator": true
      }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
    ],
    presets: presetsCommon,
  };
}

if (env === 'development') {
  module.exports = {
    plugins: [
      ["@babel/transform-runtime", {
        "regenerator": true
      }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
    ],
    presets: presetsCommon,
  };
}
