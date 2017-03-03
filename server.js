var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config.js');
var express = require('express');
var open = require('open');
const path = require('path');

const compiler = webpack(webpackConfig);
const app = express();
const url = 'http://localhost:5454/';

app.use(express.static(__dirname + '/'));

const serverOptions = {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
};

app.use(webpackMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));

app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'app/index.dev.html'));
});


app.listen(5454, function onStart(err) {
  if (err) {
    console.log(err);
  }
  open(url);
  console.info('Listening to =>%s in your browser.', url);
});