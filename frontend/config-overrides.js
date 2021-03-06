
const {
    override,
    fixBabelImports,
    addLessLoader,
    addWebpackAlias,
    addWebpackModuleRule,
    addWebpackPlugin,
} = require('customize-cra'); // eslint-disable-line
const path = require('path');
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// https://medium.com/@mzohaib.qc/ant-design-dynamic-runtime-theme-1f9a1a030ba0
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');

module.exports = override(
    config => ({
        ...config,
        output: {
            ...config.output,
            globalObject: 'this',
        },
    }),

    addWebpackModuleRule({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
    }),

    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),

    // addWebpackPlugin(
    //   new MonacoWebpackPlugin({
    //     languages: ['json', 'javascript'],
    //   }),
    // ),

    addWebpackPlugin(
        new AntDesignThemePlugin({
            varFile: path.join(__dirname, './src/styles/variables.less'),
            mainLessFile: path.join(__dirname, './src/styles/index.less'),
            antDir: path.join(__dirname, './node_modules/antd'),
            stylesDir: path.join(__dirname, './src/styles'),
            themeVariables: Object.keys(
                lessToJs(
                    fs.readFileSync(
                        path.join(
                            __dirname,
                            './node_modules/antd/lib/style/themes/default.less',
                        ),
                        'utf8',
                    ),
                ),
            ),
            // indexFileName: 'index.html',
            generateOnce: true,
        }),
    ),

    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            // '@primary-color': '#1da57a',
            '@font-size-base': '12px',
            // '@layout-header-background': '#fafafa',
            // '@menu-bg': '#fafafa',
            // '@layout-slider-background': '#f0f0f0',
            // '@layout-body-background': '#ffffff',
            // '@layout-trigger-background': '#7c7c7c',
        },
    }),

    // when adding alias, also it need to config vscode, jest and eslint:
    //  vscode --> root/jsconfig.json
    //  jest --> package.json
    //  eslint --> .eslintrc.js
    //  storybook --> .storybook/main.js
    addWebpackAlias({
        '@': path.resolve(__dirname, './src'),
        '@js': path.resolve(__dirname, './src/js'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@components': path.resolve(__dirname, './src/components'),
        '@locales': path.resolve(__dirname, './src/locales/i18n'),
    }),
);
