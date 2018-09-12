const SerialPort = require('serialport'),
	serialPort = new SerialPort('/dev/tty.usbmodem1421', {
		baudRate: 9600
	}),
	Printer = require('thermalprinter'),
	logo = 'cached.png',
	PersonalityTextSummaries = require('personality-text-summary'),
	data = require("./demo_data.json");


function prepareLikes(likes) {
	// likes.reduce((obj, l) => {
	// 	var sep = l.length ? " - " : "";
	// 	return l.name + sep;
	// }, '')	

	return likes.map((l) => {
		return l.name; }).join(", ");
}

function preparePersonality(personality) {
	return personality.map((p) => {
		return p.name + " - " + String(p.percentile*100).substring(0, 4) + "%";
	})
}

var v3EnglishTextSummaries = new PersonalityTextSummaries({ locale: 'en', version: 'v3' });
var textSummary  = v3EnglishTextSummaries.getSummary(data.raw);

var personalityStrings = preparePersonality(data.raw.personality);

/* */
serialPort.on('open', () => {
	var printer = new Printer(serialPort);
	printer.on('ready', () => {
		console.log('Begin');
		printer
			.printImage(logo)
			.center()
			.bold(true)
			.printLine(data.identifier)
			.left()
			.bold(false)
			.printLine(prepareLikes(data.likes))
			.horizontalLine(33)
			.printLine(personalityStrings[0])
			.printLine(personalityStrings[1])
			.printLine(personalityStrings[2])
			.printLine(personalityStrings[3])
			.printLine(personalityStrings[4])
			.horizontalLine(33)
			.printLine(textSummary)
			.horizontalLine(33)
			.print(() => {
				console.log('The end');
				process.exit();
			})
	});
});

/*  */


// // serialPort.on('open',function() {
// 	var printer = new Printer(serialPort);
// 	printer.on('ready', function() {
// 		console.log('ready')
// 		printer
// 			.printLine('THIS IS :     ')
// 			.bold(false)
// 			.inverse(true)
// 			.big(true)
// 			.printLine('JAVASCRIPT')
// 			.printImage(path)
// 			.printLine('BITCHESSSSZ')
// 			.bold(false)
// 			.big(false)
// 			.print(function() {
// 				console.log('done');
// 				process.exit();
// 			});
// 	});
// });