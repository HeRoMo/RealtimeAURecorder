import GasPlugin from 'gas-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import path from 'path';

export default {
  context: path.resolve(__dirname, 'src'),
  entry: {
    code: './code.js',
    doget: './doget.js',
  },
  output: {
    path: path.resolve(__dirname, 'dest'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new GasPlugin(),
    new CopyWebpackPlugin([
      { from: 'appsscript.json', to: './' },
      { from: '*.html', to: './' },
    ], {}),
  ],
};
