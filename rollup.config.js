import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const input = './src/index.js';

let config;

const cjs = {
  input,
  output: {
    file: pkg.main,
    format: 'cjs',
  },
  external: ['react', 'react-dom'],
  plugins: [
    babel({
      // https://github.com/rollup/rollup-plugin-babel#helpers
      runtimeHelpers: true,
    }),
    nodeResolve(),
    commonjs(),
    // any internal style dependencies (flatpickr, react-image-crop)
    // we need to load into the DOM
    postcss({
      extract: false,
      inject: true,
      minimize: true,
    }),
  ],
};

const esm = {
  input,
  output: {
    file: pkg.module,
    format: 'esm',
  },
  external: ['react', 'react-dom'],
  plugins: [
    babel({
      runtimeHelpers: true,
    }),
    nodeResolve(),
    commonjs(),
    postcss({
      extract: false,
      inject: true,
      minimize: true,
    }),
  ],
};

const umd = {
  input,
  output: {
    file: 'dist/umd/openlaw-elements.js',
    format: 'umd',
    name: 'OpenLawForm',
    globals: {
      'prop-types': 'PropTypes',
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  external: ['prop-types', 'react', 'react-dom'],
  plugins: [
    babel({
      runtimeHelpers: true,
    }),
    nodeResolve(),
    commonjs(),
    postcss({
      extract: false,
      inject: true,
      minimize: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    terser(),
  ],
};

if (process.env.NODE_ENV === 'cjs') {
  config = cjs;
}

if (process.env.NODE_ENV === 'esm') {
  config = esm;
}

if (process.env.NODE_ENV === 'umd') {
  config = umd;
}

export default config;
