const mocked = process.env.MOCK !== undefined;
const printFormatted = require('./printer.js');
const SerialPort = require("serialport");
const Printer = require("thermalprinter");
const PrinterMock = require('./printer-mock.js');
const SERIAL_PORT = '/dev/ttyACM0';
let buffer = []
let printing = false

let serialPort, printer;


module.exports = function(data){
  console.log(data.identifier);
  buffer.push(data);
  initializePrinter(printNextOrCloseSerial)

  function printNextOrCloseSerial(){
    printing = true
    const thisData = buffer.splice(0, 1)[0];
    if(thisData){
      printFormatted(thisData, printer);
      printer.print(printNextOrCloseSerial);
    }
    else{
      console.log('Closing socket')
      serialPort.close()
      printer = null
      serialPort = null
      printing = false
    }
  }
}
function initializePrinter(callback) {
  if (mocked) {
    printer = new PrinterMock()
    setTimeout(() => callback(printer), 3000);
  }
  else if(!serialPort && !printer){
    console.log('Opening port')
    serialPort = new SerialPort(SERIAL_PORT, {
      baudRate: 19200,
    });
    serialPort.on("open", () => {
      // PrinterMock allows to run without the printer connected \o/
      printer = new Printer(serialPort, {
        maxPrintingDots: 6,
        heatingTime: 110,
        heatingInterval: 5,
        commandDelay: 10
      });
      printer.on("ready", callback)
    })
  }
}
