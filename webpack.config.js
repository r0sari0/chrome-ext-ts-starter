const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

let config = {
    entry: {
        'content-script/content': './src/content-script/content.ts',
        'background-script/background': './src/background-script/background.ts',
        'browser-action/popup': './src/browser-action/popup.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'src/manifest.json', to: 'manifest.json'},
            {from: 'src/res/icons', to: 'icons'},
            {from: 'src/browser-action/popup.html', to: 'browser-action'}
        ])
    ]
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        config.watch = true;
        config.plugins.push(new ChromeExtensionReloader({
            port: 9090,
            reloadPage: true,
            entries: {
                contentScript: 'content-script/content',
                background: 'background-script/background'
            }
        }))
    }
    return config;
};
