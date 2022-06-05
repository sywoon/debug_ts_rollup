// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
  input: './src/main.js',
  output: {
    file: './dist/js/main.min.js',
    format: 'cjs'   //iife
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'  // 排除node_module下的所有文件
    })
  ]
}