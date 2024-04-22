const path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'ts'),
    devtool: "inline-source-map",
    entry: './client.ts',
    mode: 'development',
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'gen/assets/js')
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    }
};