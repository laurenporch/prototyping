const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const isDevelopment = env.NODE_ENV === 'development';

    return {
        mode: isDevelopment ? 'development' : 'production',
        entry: path.join(__dirname, "src", "index.js"),
        output: {
            path: path.resolve(__dirname, "dist"),
        },
        module: {
            rules: [
                {
                    test: /\.?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "src", "index.html"),
            }),
        ],
    }
}