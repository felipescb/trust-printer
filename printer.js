const SerialPort = require("serialport");
const Printer = require("thermalprinter");
const i18n = require('./i18n');

const SERIAL_PORT = '/dev/tty.usbserial-1410';

module.exports = function({ identifier, personalityStrings, extremes, market }) {
    const serialPort = new SerialPort(SERIAL_PORT, {
        // baudRate: 9600,
        baudRate: 19200,
    });
	const logo = "cachedRRR.png";

    serialPort.on("open", () => {
        var printer = new Printer(serialPort, { 
            // maxPrintingDots: 8,
            // heatingTime: 100,
            // heatingInterval: 3,
            // commandDelay: 3
            maxPrintingDots: 6,
            heatingTime: 100,
            heatingInterval: 3,
            commandDelay: 10
        });
        printer.on("ready", () => {
            console.log("Begin");
            printer
                .left()
            printEmptyLines(8)
            printer.printImage(logo)
            printEmptyLines(5)
            printer.horizontalLine(33)
            printEmptyLines(40)
            printer
                .inverse(false)
                .big(false)
                .left()
                .printLine(" www.cached.id ")
                .inverse(false)
                .big(false)
                .left()
                .printLine(" ")
                .center()
                .bold(false)
                .big(true)
                .inverse(true)
                .printLine(" " + identifier + " ")
                .inverse(false)
                .printLine(" ")
                .inverse(true)
                .big(false)
                .left()
                .printLine(i18n.coreTraits[lang])
                .left()
                .small(true)
                .inverse(false)
            printArray(personalityStrings)
            printer
                .printLine("   ")
                .horizontalLine(33)
                .printLine("   ")
                .big(false)
                .small(true)
                .bold(true)
                .left()
                .inverse(true)
                .printLine(i18n.extreme[lang])
                .inverse(false)
                .big(false)
                .bold(false)
                .small(true)
                .left()
            printArray(extremes)
            printer
                .printLine(" ")
                .horizontalLine(33)
                .printLine("   ")         
                .left()
                .big(false)
                .small(true)
                .bold(true)
                .inverse(true)
                .printLine(i18n.likely[lang])
                .inverse(false)
                .big(false)
                .bold(false)
                .small(true)
            printArray(market.likely)
            printer
                .big(false)
                .left()
                .printLine("")
                .left()
                .big(false)
                .small(true)
                .bold(true)
                .inverse(true)
                .printLine(i18n.notLikely[lang])
                .inverse(false)
                .big(false)
                .bold(false)
                .small(true)
            printArray(market.notLikely)
            printer
                .left()
                .printLine("")
                .small(false)
                .big(false)
                //.horizontalLine(33)

                .big(false)
                .left()
                // .printSodexoDrinks(); 
                // printer.
                .small(true)
                .center()
                .printLine("Thank you for trusting us.")
                .left()
                .small(false)
                .big(false)
            printEmptyLines(6)
            printer
                .center()
            printEmptyLines(4)
            printer
				.print(() => {
					console.log("The end");
					serialPort.close();
				});
        });
        
        function printEmptyLines(n){
            for (let i = 0; i < n; i++) {
                printer.printLine('')
            }
        }

        function printArray(arr, preprocess = (in_)=> `- ${in_}`) {
            arr.forEach((elem) => printer.printLine(preprocess(elem)) )
        }

        function printSodexoDrinks(){
            printer
                .printImage(drinks)
                .inverse(false)
                .big(false)
                .left()
                .printLine("")
                .big(false)
                .inverse(false)
                .left()
                .small(true)
                .printLine(i18n.freeDrink01[lang])
                .printLine(i18n.freeDrink02[lang])
                .printLine(i18n.freeDrink03[lang])
                .center()
                .printLine("")
                .printImage(sodexo)
        }
  
	});
};