const path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',

    entry: [
    'webpack-hot-middleware/client?reload=true',
    'webpack/hot/dev-server',
    path.join(__dirname, 'app/entry.js')
  ],

    output: {
        path: '/',
        filename: 'main.js',
        publicPath: '/'
    },

    resolve: {
        modules: ['custom_modules', 'node_modules']
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|custom_modules)/,
                loaders: "babel-loader"
            },
            {
                test: /\.html$/,
                loaders: "file-loader"
            },
            {
                test: /\.(s?css)/,
                loader: "style-loader!css-loader!postcss-loader!sass-loader"
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: () => {
                    return [autoprefixer];
                }
            }
        })
    ]
};