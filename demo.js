const SerialPort = require('serialport');
const PersonalityTextSummaries = require('personality-text-summary');
const Printer = require('thermalprinter');
const data = require('./demo_data.json');

    const lang = data.lang.toUpperCase();

    const serialPort = new SerialPort('/dev/ttyACM0', {
      baudRate: 19200,
    });

    const logo = "cached.png",
        drinks = "drinks_new.png",
        sodexo = "sodexo.png";

    function prepareLikes(likes) {
        return likes
            .map(l => {
                return l.name;
            })
            .join(", ");
    }

    function preparePersonality(personality) {
        return personality.map(p => {
            const name = ((lang == "FR") ? p.fr_name : p.name);
            return (
                name +
                " - " +
                String(p.score * 100).substring(0, 4) +
                "%"
            );
        });
    }

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    //Reduce the right way
    function flatten(arr) {
        return arr.reduce(function(flat, toFlatten) {
            return flat.concat(
                Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
            );
        }, []);
    }

    //fuck ...es6
    function normalizeMarketString(string) {
        let removeString;
        if (lang == "FR") {
            removeString = "Susceptible"
            string = string.fr_name;
        } else {
            removeString = "Likely to";
            string = string.name;
        }
        var core = string.replace(removeString, "");
        return core.charAt(0).toUpperCase() + core.slice(1);
    }

    function prepareMarket(market) {
        var likely = flatten(
            market.map(function(c) {
                return c.preferences.filter(function(i) {
                    return i.score == 1;
                });
            })
        ).slice(0, 5);

        var notLikely = flatten(
            market.map(function(c) {
                return c.preferences.filter(function(i) {
                    return i.score == 0;
                });
            })
        ).slice(0, 5);

        return {
            likely: shuffle(likely),
            notLikely: shuffle(notLikely)
        };
    }

    function prepareCorePhrase(i) {
        if (lang == "FR") {
            return "- " +  i.fr_phrase + " - " + String(i.score * 100).substring(0, 4) + "%"
        } else {
           return "- " +  i.phrase + " - " + String(i.score * 100).substring(0, 4) + "%"
        }
    }

    var v3EnglishTextSummaries = new PersonalityTextSummaries({
        locale: "en",
        version: "v3"
    });
    var textSummary = v3EnglishTextSummaries.getSummary(data.raw);

    var personalityStrings = preparePersonality(data.facets);

    var market = prepareMarket(data.marketPreferences);

    var cached = data.cached;

    const i18n = {
      likely: {
        EN: 'You are likely to: ',
        FR: 'Susceptible: ',
      },
      notLikely: {
        EN : 'You are not likely to: ',
        FR : 'Non susceptible: '
      },
      freeDrink01 : {
        EN : 'You may exchange this receipt at the bar',
        FR : 'Vous pouvez échanger ce reçu au bar'
      },
      freeDrink02 : {
        EN : 'for a free drink. By doing so, you agree',
        FR : 'contre une boisson. Ce faisant, vous acceptez'
      },
      freeDrink03 : {
        EN : 'to donate it to the installation.',
        FR : 'de le donner à l’installation.'
      },
      coreTraits : {
        EN : 'Core Traits: ',
        FR : 'Traits de caractère dominants: '
      },
      extreme : {
        EN : 'Extreme Characteristics: ',
        FR : 'Caractéristiques extremes: '
      },
    }

    serialPort.on("open", () => {
        var printer = new Printer(serialPort, {
            // maxPrintingDots: 8,
            // heatingTime: 100,
            // heatingInterval: 3,
            // commandDelay: 3
            maxPrintingDots: 6,
            heatingTime: 105,
            heatingInterval: 6,
            commandDelay: 50
        });
        printer.on("ready", () => {
            console.log("Begin");
            printer
                .printImage(logo)
                .big(true)
                .inverse(true)
                .center()
                .printLine(" " + data.identifier + " ")
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
                .printLine(prepareCorePhrase(cached[0]))
                .printLine(prepareCorePhrase(cached[1]))
                .printLine(prepareCorePhrase(cached[2]))
                .printLine(prepareCorePhrase(cached[3]))
                .printLine(prepareCorePhrase(cached[4]))
                .printLine(prepareCorePhrase(cached[5]))
                .printLine(prepareCorePhrase(cached[6]))
                .printLine(prepareCorePhrase(cached[7]))
                .printLine(prepareCorePhrase(cached[8]))
                .printLine(prepareCorePhrase(cached[9]))

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
                .left()
                .printLine("- " + normalizeMarketString(market.likely[0]))
                .printLine("- " + normalizeMarketString(market.likely[1]))
                .printLine("- " + normalizeMarketString(market.likely[2]))
                .printLine("- " + normalizeMarketString(market.likely[3]))
                .printLine("- " + normalizeMarketString(market.likely[4]))
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
                .printLine(
                    "- " + normalizeMarketString(market.notLikely[0])
                )
                .printLine(
                    "- " + normalizeMarketString(market.notLikely[1])
                )
                .printLine(
                    "- " + normalizeMarketString(market.notLikely[2])
                )
                .printLine(
                    "- " + normalizeMarketString(market.notLikely[3])
                )
                .printLine(
                    "- " + normalizeMarketString(market.notLikely[4])
                )
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
                //.left()
                .small(false)
                .big(false)
                .printLine(" ")
                //.horizontalLine(33)
                //.printLine(" ")
                //.printLine(" ")
                .printLine(" ")
                .printLine(" ")
                .printLine(" ")
                .print(() => {
                    console.log("The end");
                });
        });
    });
