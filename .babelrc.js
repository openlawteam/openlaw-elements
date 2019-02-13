const env = process.env.NODE_ENV;

if (env === 'development') {
  module.exports = {
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      ["@babel/transform-runtime", {
        "regenerator": true
      }],
    ],
    presets: [
      "@babel/preset-react",
      '@babel/preset-flow',
      ['@babel/preset-env', {modules: false}],
    ],
  };
}
