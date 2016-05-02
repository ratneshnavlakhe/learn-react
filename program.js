var React = require('react');
var ReactDOMServer = require('react-dom/server');
var DOM = React.DOM;
var body = DOM.body;
var div = DOM.div;
var script = DOM.script;

var browserify = require('browserify');
var babelify = require('babelify');

require('babel/register')({
  ignore: false
});

var TodoBox = require('./views/index.jsx');

var express = require('express');
var app = express();

app.use('/bundle.js', function (req, res) {
	res.setHeader('Content-type', 'application/javascript');
	
	browserify({ debug: true })
		.transform(babelify.configure({
			presets: ["react", "es2015"],
			compact: false
		}))
		.require("./app.js", { entry: true })
		.bundle()
		.pipe(res);
})

app.use('/', function (req, res) {
  var initialData = JSON.stringify(data);
  var markup = ReactDOMServer.renderToString(React.createElement(TodoBox, { data: data }));

  res.setHeader('Content-Type', 'text/html');

  var html = ReactDOMServer.renderToStaticMarkup(body(null,
    div({id: 'app', dangerouslySetInnerHTML: {__html: markup}}),
    script({
      id: 'initial-data',
      type: 'text/plain',
      'data-json': initialData
    }),
    script({ src: '/bundle.js' })
  ));

  res.end(html);
});
app.set('port', (process.argv[2] || 3000));
app.set('view engine', 'jsx');
app.set('views', __dirname + '/views');
app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));

app.listen(app.get('port'), function() {
//data.push({ title: 'Shopping' , 'detail': process.argv[3]});
//data.push({ title: 'Hair cut', 'detail': process.argv[4]});
console.log('listening on port 3000');
});
