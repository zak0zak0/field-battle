const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDevServer = process.env.DEV_SERVER;

module.exports = env => {
    return {
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 1000,
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].bundle.css',
                chunkFilename: '[id].css'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                template: 'public/index.html'
            }),
            new webpack.DefinePlugin({
                'process.env.WEBPACK_DEV_SERVER': JSON.stringify(isDevServer),
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            }),
            new CopyPlugin({
                patterns: [
                    { from: "public/images", to: "images" },
                    { from: "public/data", to: "data" },
                ],
            }),
        ],
        entry: path.resolve(__dirname, 'src', 'index.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        devServer: {
            static: path.resolve(__dirname, 'dist'),
            open: true,
            client: {
                logging: 'info',
            },
            port: 9000,
            historyApiFallback: true,
        },
        module: {
            rules: [
                {
                    test: /\.(jsx|js)$/,
                    include: path.resolve(__dirname, 'src'),
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    "targets": {
                                        "chrome": "74",
                                    },
                                    "exclude": ["transform-regenerator"]
                                }],
                                '@babel/preset-react'
                            ]
                        }
                    }
                    ]
                },
                {
                    test: /\.css$/i,
                    include: path.resolve(__dirname, 'src'),
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        'postcss-loader'
                    ]
                }
            ]
        }
    }
}