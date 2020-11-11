const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const BUILD_PATH = path.resolve(__dirname, 'dist');

module.exports = () => {
    return {
        mode: 'development',
        entry: {
            index: './src/index.js',
        },
        output: {
            path: BUILD_PATH,
            filename: '[name].js',
            library: 'IDBLog',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
        ],
    }
}
