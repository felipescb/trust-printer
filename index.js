const io = require('socket.io-client');
  addToBuffer = require('./printerBuffer'),
  http = require('http'),
  prepareDataForPrinter = require('./dataToPrinterProcessor');

const PORT = 3001;

const url = "http://localhost:3002/";
var socket = io.connect(url);
socket.on("print", (data) => printFromJSON(data))


console.log(`creating server listening on ${PORT}`)
http.createServer(function (req, res) {
  console.log('Recebeu a request... ')
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    try{
      console.log('Chegou aqui', body)
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
  addToBuffer(
    prepareDataForPrinter(
      body
    )
  );
}