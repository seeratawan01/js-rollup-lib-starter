import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import serve from 'rollup-plugin-serve'

import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import pkg from "./package.json";

const input = ["src/index.js"];

let scssOptions = {
    output: "./dist/css/style.css",
    failOnError: true,
    runtime: require("sass"),
    processor: () => postcss([autoprefixer()]),
    outputStyle: 'compressed'
}

export default [
    {
        // UMD
        input,
        plugins: [
            nodeResolve(),
            babel({
                babelHelpers: "bundled",
                exclude: 'node_modules/**'
            }),
            terser(),

            process.env.ENVIRONMENT ===  'development' ? serve({
                open: true,
                openPage: '/',
                port: 10001,
            }) : null,

            scss(scssOptions)

        ],
        output: {
            file: `dist/${pkg.name}.min.js`,
            format: "umd",
            name: "myLibrary", // this is the name of the global object
            esModule: false,
            exports: "named",
            sourcemap: true,
        },
    },// ESM and CJS
    {
        input,
        plugins: [
            nodeResolve(),
            babel({
                exclude: 'node_modules/**'
            }),
            scss(scssOptions)
        ],
        output: [
            {
                dir: "dist/esm",
                format: "esm",
                exports: "named",
                sourcemap: true,
            },
            {
                dir: "dist/cjs",
                format: "cjs",
                exports: "named",
                sourcemap: true,
            },
        ],
    },
];
