
const gulp = require("gulp");
const rollup = require("rollup");
const typescript = require('rollup-plugin-typescript2');
const glsl = require('rollup-plugin-glsl');
const matched = require('matched');
const resolve = require('rollup-plugin-node-resolve');
const path = require('path');


var packsDef = [
    {
        'libName': "core",
        'input': [
            './src/core.ts',
            './src/core/**/*.*'
        ],
        'out': './dist/core.js'
    },
    // {
    //     'libName': "client",
    //     'input': [
    //         './src/main.ts'
    //     ],
    //     'out': './dist/client.js'
    // },
]



var curPackFiles = null;  //当前包的所有的文件
var mentry = 'multientry:entry-point';
function myMultiInput() {
    var include = [];
    var exclude = [];
    function configure(config) {
        if (typeof config === 'string') {
            include = [config];
        } else if (Array.isArray(config)) {
            include = config;
        } else {
            include = config.include || [];
            exclude = config.exclude || [];

            if (config.exports === false) {
                exporter = function exporter(p) {
                    if (p.substr(p.length - 3) == '.ts') {
                        p = p.substr(0, p.length - 3);
                    }
                    return `import ${JSON.stringify(p)};`;
                };
            }
        }
    }

    var exporter = function exporter(p) {
        if (p.substr(p.length - 3) == '.ts') {
            p = p.substr(0, p.length - 3);
        }
        return `export * from ${JSON.stringify(p)};`;
    };

    return (
        {
            options(options) {
                console.log('options', options.input)
                configure(options.input);
                options.input = mentry;
            },

            resolveId(id, importer) {//mentry是个特殊字符串，rollup并不识别，所以假装这里解析一下
                console.log('resolveId', id, importer)
                if (id === mentry) {
                    return mentry;
                }
                if (mentry == importer)
                    return null;

                var importfile = path.join(path.dirname(importer), id);
                var ext = path.extname(importfile);
                if (ext != '.ts' && ext != '.glsl' && ext != '.vs' && ext != '.ps' && ext != '.fs') {
                    importfile += '.ts';
                }
                console.log('import ', importfile);
                if (curPackFiles.indexOf(importfile) < 0) {
                    //其他包里的文件
                    console.log('other pack:',id,'importer=', importer);
                    return 'Ala';
                }
            },
            load(id) {
                console.log("load", id)
                if (id === mentry) {
                    if (!include.length) {
                        return Promise.resolve('');
                    }

                    var patterns = include.concat(exclude.map(function (pattern) {
                        return '!' + pattern;
                    }));

                    console.log("patterns", patterns)
                    return matched.promise(patterns, { realpath: true }).then(function (paths) {
                        console.log("paths", paths)
                        curPackFiles = paths;   // 记录一下所有的文件
                        paths.sort();
                        var str = paths.map(exporter).join('\n');
                        console.log("load return", str);
                        return str;
                    });
                } else {
                    //console.log('load ',id);
                }
                return null;
            }
        }
    );
}

gulp.task('buildJS', async function () {
    for (let i = 0; i < packsDef.length; ++i) {
        const subTask = await rollup.rollup({
            input: packsDef[i].input,
            output: {
                extend: true,
                globals: { 'Ala': 'Ala' }
            },
            external: ['Ala'],
            plugins: [
                myMultiInput(),
                typescript({
                    tsconfig: "./tsconfig.json",
                    check: false,
                    useTsconfigDeclarationDir: true,
                    tsconfigOverride: { compilerOptions: { removeComments: true } }
                }),
                glsl({
                    include: /.*(.glsl|.vs|.fs)$/,
                    sourceMap: false,
                    compress: false
                }),
            ]
        });

        await subTask.write({
            file: packsDef[i].out,
            format: 'iife',
            name: 'Ala',
            sourcemap: true,
            extend: true,
            globals: { 'Ala': 'Ala' }
        });
    }
});


function compile() {
    return rollup.rollup({
        input: './src/main.ts',
        treeshake: true,//建议忽略
        plugins: [
            typescript({
                tsconfig: "./tsconfig.json",
                check: true,
                clean: false,
                useTsconfigDeclarationDir: false,
                tsconfigOverride: { compilerOptions: { "declaration": false,
                    removeComments: true } }
            }),
            glsl({
                include: /.*(.glsl|.vs|.fs)$/,
                sourceMap: true,
                compress: false
            }),
        ]
    }).then(bundle => {
        return bundle.write({
            file: 'dist/client.js', // package.json 中 "main": "dist/index.iife.js",
			format: 'iife', // 可以嵌入html中 通过<script>标签来使用
            name: 'mygame',
			sourcemap: true
        });
    });
}




// gulp.task('default', gulp.series(compile))   //方法1  传统方式  一个ts入口文件
gulp.task('default', gulp.series("buildJS", compile))   //方法2  模仿laya 自定义多个ts入口


