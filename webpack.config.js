const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [__dirname].concat(args))
}

module.exports = {
  context: __dirname,
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.scss', '.pug']
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader?presets[]=es2015']},
      { test: /\.ts$/, exclude: /node_modules/, loaders: ['ts-loader'] },
      { test: /\.html$/, loaders: 'raw-loader' },
      { test: /\.css$/, loaders: ['file-loader?name=main.bundle.css', 'extract-loader', 'css-loader', 'resolve-url-loader'] },
      { test: /\.json$/, loader: 'raw-loader' },
      { test: /\.scss$/, exclude: /node_modules/, loaders: ['file-loader?name=main.bundle.css', 'extract-loader', 'css-loader?minimize', 'resolve-url-loader', 'sass-loader'] },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      { test: /\.(jpe?g|gif|png)?$/, loader: 'url-loader' }
    ]
  },
  externals: [nodeExternals({
    whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]
  })],
  entry: {
    main: root('src/main.js'),
  },
  output: {
    publicPath: path.resolve(__dirname),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.map',
    path: root('dist'),
    devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
  },
  plugins: [
    // new UglifyJsPlugin({
    //   beautify: false,
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: true
    //   },
    //   compress: {
    //     screw_ie8: true,
    //     warnings: false
    //   },
    //   comments: false,
    //   sourceMap: true
    // })

    new CleanWebpackPlugin(['dist'], {
      root: root('')
    })
  ],
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
}
