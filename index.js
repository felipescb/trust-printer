const print = require('./app.js')
var http = require('http');

http.createServer(function (req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    print(JSON.parse(body));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World!');
    res.end('ok');
  });
}).listen(3001);