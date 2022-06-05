// Rollup plugins
import typescript from 'rollup-plugin-typescript2'; // 处理typescript
import babel from 'rollup-plugin-babel'; // 处理es6
import resolve from '@rollup/plugin-node-resolve'; // 你的包用到第三方npm包
import commonjs from '@rollup/plugin-commonjs'; // 你的包用到的第三方只有commonjs形式的包
import builtins from 'rollup-plugin-node-builtins'; // 如果你的包或依赖用到了node环境的builtins fs等
import globals from 'rollup-plugin-node-globals'; // 如果你的包或依赖用到了globals变量
import { terser } from 'rollup-plugin-terser'; // 压缩，可以判断模式，开发模式不加入到plugins


export default {
	input: './src/main.ts',
	output: [
		{
			file: 'dist/main.esm.js', // package.json 中 "module": "dist/index.esm.js"
			format: 'esm', // es module 形式的包， 用来import 导入， 可以tree shaking
			sourcemap: true
		}, {
			file: 'dist/main.cjs.js', // package.json 中 "main": "dist/index.cjs.js",
			format: 'cjs', // commonjs 形式的包， require 导入 
			sourcemap: true
		}, {
			file: 'dist/main.umd.js',
			name: 'Main',
			format: 'umd', // umd 兼容形式的包， 可以直接应用于网页 script
			sourcemap: true
		}
	],
	plugins: [
		typescript({
			//tsconfig: "./tsconfig.json",
			check: false,
			clean: true
			// tsconfigOverride: { compilerOptions: { removeComments: true } }
		}),
		babel({
			exclude: 'node_modules/**'  // 排除node_module下的所有文件
		})
	]
}