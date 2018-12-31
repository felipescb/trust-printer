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
                .printLine("- " + personalityStrings[0])
                .printLine("- " + personalityStrings[1])
                .printLine("- " + personalityStrings[2])
                .printLine("- " + personalityStrings[3])
                .printLine("- " + personalityStrings[4])
                
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
                .printLine(prepareCorePhrase(extremes[0]))
                .printLine(prepareCorePhrase(extremes[1]))
                .printLine(prepareCorePhrase(extremes[2]))
                .printLine(prepareCorePhrase(extremes[3]))
                .printLine(prepareCorePhrase(extremes[4]))
                .printLine(prepareCorePhrase(extremes[5]))
                .printLine(prepareCorePhrase(extremes[6]))
                .printLine(prepareCorePhrase(extremes[7]))
                .printLine(prepareCorePhrase(extremes[8]))
                .printLine(prepareCorePhrase(extremes[9]))
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
                .printLine("- " + market.likely[0])
                .printLine("- " + market.likely[1])
                .printLine("- " + market.likely[2])
                .printLine("- " + market.likely[3])
                .printLine("- " + market.likely[4])
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
                .printLine("- " + market.notLikely[0])
                .printLine("- " + market.notLikely[1])
                .printLine("- " + market.notLikely[2])
                .printLine("- " + market.notLikely[3])
                .printLine("- " + market.notLikely[4])
                .left()
                .printLine("")
                .small(false)
                .big(false)
                //.horizontalLine(33)

                .big(false)
                .left()
                 //.printImage(drinks)
                
                // .inverse(false)
                // .big(false)
                // .left()
                // .printLine("")
                // .big(false)
                // .inverse(false)
                // .left()
                // .small(true)
                // .printLine(i18n.freeDrink01[lang])
                // .printLine(i18n.freeDrink02[lang])
                // .printLine(i18n.freeDrink03[lang])
                //.center()
                //.printLine("")
                // .printImage(sodexo)
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

        function prepareCorePhrase(i) {
            if (lang == "FR") {
                return "- " + i.facet_normalized_fr + " - " + i.fr_phrase + " - " + String(i.score * 100).substring(0, 4) + "%"
            } else {
                return "- " + i.facet_normalized + " - " + +  i.phrase + " - " + String(i.score * 100).substring(0, 4) + "%"
            }
        }
	});
};