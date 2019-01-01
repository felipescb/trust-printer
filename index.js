const io = require('socket.io-client');
const print = require('./printer.js'),
http = require('http'),
prepareDataForPrinter = require('./dataToPrinterProcessor');

const PORT = 3001;

const url = "http://localhost:3000/";
var socket = io.connect(url);
socket.on("print", (data) => printFromJSON(data))


console.log(`creating server listening on ${PORT}`)
http.createServer(function (req, res) {
  console.log('Recebeu a request... ')
  
  let body = '';
  
  req.on('data', chunk => {
    // console.log('data', chunk.toString())
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    try{
      console.log('Chegou aqui')
      printFromJSON(JSON.parse(body));
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Hello World!');
      res.end('ok');
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.write(error.toString());
      res.end()
    }
  });
}).listen(PORT, () => console.log(`Listening on Port ${PORT}`));

function printFromJSON(body) {
  print(
    prepareDataForPrinter(
      body
    )
  );
}