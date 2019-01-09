const SERIAL_PORT = '/dev/tty.usbserial-1410';


var SerialPort = require('serialport'),
  serialPort = new SerialPort(SERIAL_PORT, {
    baudRate: 9600,
  }),
  Printer = require('thermalprinter');


serialPort.on('open', function () {
  var printer = new Printer(serialPort);
  printer.on('ready', function () {
    printer
      .indent(10)
      .horizontalLine(16)
      .bold(true)
      .indent(10)
      .printLine('first line')
      .bold(false)
      .inverse(true)
      .printLine(' ')
      .big(true)
      .right()
      .printLine('second line')
      .printLine(' ')
      .printLine(' ')
      .printLine(' ')
      .printLine(' ')
      .print(function () {
        console.log('done');
        process.exit();
      });
  });
});