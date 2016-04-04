var dirs = ['js', 'libs', 'images', 'css', 'views'],
	port = 5555,
	express = require('express'),
	app = express();

app.set('views', __dirname + '/');

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
})

for (var i=0; i<dirs.length ; i++){
	var dir = '/' + dirs[i];
	app.use(dir, express.static(__dirname + dir));
}

app.listen(port, function() {
  console.log('listening at port: %s', port);
});