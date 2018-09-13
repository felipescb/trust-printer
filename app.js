const SerialPort = require('serialport');
const PersonalityTextSummaries = require('personality-text-summary');
const Printer = require('thermalprinter');

module.exports = function (data){
	const serialPort = new SerialPort('/dev/tty.usbmodem1421', {
			baudRate: 9600
		}),
		logo = 'cached.png';


	function prepareLikes(likes) {
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
				})
		});
	});
}