import GasPlugin from 'gas-webpack-plugin';
import Dotenv from 'dotenv-webpack';

import path from 'path';

export default {
  context: path.resolve(__dirname, 'src'),
  entry: {
    code: './code.js',
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
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: './[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new GasPlugin(),
    new Dotenv(),
  ],
};
