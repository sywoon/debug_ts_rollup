
const gulp = require("gulp");
const rollup = require("rollup");
const typescript = require('rollup-plugin-typescript2');
const glsl = require('rollup-plugin-glsl');



var packsDef = [
    {
        'libName': "core",
        'input': [
            './src/core.ts',
            './src/core/**/*.*'
        ],
        'out': './dist/core.js'
    },
    {
        'libName': "client",
        'input': [
            './src/main.ts'
        ],
        'out': './dist/client.js'
    },
]



function compile() {
    return rollup.rollup({
        input: './src/main.ts',
        treeshake: true,//建议忽略
        plugins: [
            typescript({
                tsconfig: "./tsconfig.json",
                check: true,
                clean: false,
                useTsconfigDeclarationDir: true,
                // tsconfigOverride: { compilerOptions: { removeComments: true } }
            }),
            glsl({
                include: /.*(.glsl|.vs|.fs)$/,
                sourceMap: true,
                compress: false
            }),
        ]
    }).then(bundle => {
        return bundle.write({
            file: 'dist/main.iife.js', // package.json 中 "main": "dist/index.iife.js",
			format: 'iife', // 可以嵌入html中 通过<script>标签来使用
            name: 'mygame',
			sourcemap: true
        });
    });
}




gulp.task('default', gulp.series(compile))



