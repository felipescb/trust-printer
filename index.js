const print = require('./app.js')
const SerialPort = require("serialport")
var http = require('http');

// SerialPort.list().then(
//   ports => ports.forEach(console.log),
//   err => console.error(err)
// )

const port = process.argv[0] || '/dev/ttyACM0';

http.createServer(function (req, res) {
  
  console.log('Recebeu a request... ')

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });

  req.on('end', () => {
    console.log('Chegou aqui')
    print(JSON.parse(body), port);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World!');
    res.end('ok');
  });

}).listen(3001, () => console.log('Listening on Port'));
