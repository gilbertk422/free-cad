const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack  = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = (env)=> {

    let prodPlugins = [];

    if(env.NODE_ENV=="production"){
        prodPlugins.push(new JavaScriptObfuscator({
            compact: true,
        }, ['popup.js', 'Container.js', 'index.js', 'bootstrap.js']));
        prodPlugins.push(new TerserPlugin());
    }

    return {
        mode: env.NODE_ENV, // "production" | "development" | "none"  // Chosen mode tells webpack to use its built-in optimizations accordingly.
        entry: {
            Container: "./src/Container.js",
            math: "./src/model/math/index.js",
            bootstrap: "./src/bootstrap.js",
            popup: "./src/ui/popup.js",
            //React enry point
            index: "./src/ui/index.js"
        },
        output: {
            path: path.resolve(__dirname + "/public/dist/"),
            filename: "[name].js",
            publicPath: "dist/", // string    // the url to the output directory resolved relative to the HTML page
            libraryTarget: "umd" // universal module definition    // the type of the exported library
            /* Advanced output configuration (click to show) */
        },
        module: {
            // configuration regarding modules
            rules: [
                // rules for modules (configure loaders, parser options, etc.)
                {
                    test: /\.jsx?$/,
                    include: [path.resolve(__dirname, "app")],
                    exclude: [path.resolve(__dirname, "app/demo-files")],
                    // conditions for the issuer (the origin of the import)
                    enforce: "pre",
                    enforce: "post",
                    // flags to apply these rules, even if they are overridden (advanced option)
                    loader: "babel-loader",
                    // the loader which should be applied, it'll be resolved relative to the context
                    // -loader suffix is no longer optional in webpack2 for clarity reasons
                    // see webpack 1 upgrade guide
                    options: {
                        presets: ["es2015"]
                    }
                    // options for the loader
                },
                //React and SCSS config
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                        "sass-loader" // compiles Sass to CSS, using Node Sass by default
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        "css-loader", // translates CSS into CommonJS
                    ]
                },
                // { test: /\.xml$/, use: { loader: "xml-loader" } }

            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV: JSON.stringify(env.NODE_ENV),
            }), ...prodPlugins
            ,
            new HtmlWebpackPlugin({
                hash: true,
                template: './src/ui/index.html',
                filename: '../index.html'
            })
        ]
    };
}
