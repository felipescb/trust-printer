const print = require('./printer.js'),
  http = require('http'),
  prepareDataForPrinter = require('./dataToPrinterProcessor');

const PORT = 3001;


console.log(`creating server listening on ${PORT}`)
http.createServer(function (req, res) {
  console.log('Recebeu a request... ')

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    console.log('Chegou aqui')
    print(
      prepareDataForPrinter(
        JSON.parse(body)
      )
    );
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World!');
    res.end('ok');
  });

}).listen(PORT, () => console.log(`Listening on Port ${PORT}`));
