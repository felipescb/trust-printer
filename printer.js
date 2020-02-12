
const i18n = require('./i18n');

const logo = "./cached.png";

module.exports = function({ lang, identifier, personalityStrings, extremes, needs, values, market }, printer, callback) {
    initFormats();
    console.log("Start of printing instructions for ", identifier);
    printEmptyLines(5)
    printer.printImage(logo)

/*    // Intro
    printer
        .center()
        // .big(true)
        .printLine("www.cached.id")
        // .big(false)
        .printLine(" ")
*/

        // Name
    printer
        .center()
        .bold(false)
        .big(true)
        .inverse(true)
        .printLine(" " + identifier + " ")
        .inverse(false)
        .big(false)

    // Core Traits
    printer.printLine(" ").horizontalLine(33)
    printTitle(i18n.coreTraits[lang]);
    printer.
        small(true);
    printArray(personalityStrings)
    printer.
        small(false);
    printer.printLine(" ").horizontalLine(33)
    // Extreme Characteristics
    printTitle(i18n.extreme[lang])
    printer.
        small(true);
    printArray(extremes)
    printer.
        small(false);
    printer.printLine(" ").horizontalLine(33)
    //needs
    printTitle(i18n.needs[lang])
    printer.
        small(true);
    printArray(needs)
    printer.
        small(false);
    printer.printLine(" ").horizontalLine(33)
    //values
    printTitle(i18n.values[lang])
    printer.
        small(true);
    printArray(values)
    printer.
        small(false);
    printer.printLine(" ").horizontalLine(33)
    // Market Preferences
    printTitle(i18n.likely[lang])
    printer.
        small(true);
    printArray(market.likely)
    printer.
        small(false);
    printTitle(i18n.notLikely[lang])
    printer.
        small(true);
    printArray(market.notLikely)
    printer.
        small(false);

    // End
    printer
        .printLine(" ")
        .printLine(" ")
        // .printSodexoDrinks();
        .small(true)
        .center()
        .printLine("Thank you for trusting us.")
        printEmptyLines(8)

    function initFormats(){
        printer.inverse(false).big(false).small(true).left();
    }
    // TODO: patch `printer` to have these functions, maybe prefixed?
    function printTitle(title){
        printer
        .printLine(' ')
        .left().big(false).small(true).bold(true)
        .inverse(true)
        .printLine(title)
        .inverse(false)
        .bold(false)
    }
    function printEmptyLines(n){
        for (let i = 0; i < n; i++) {
            printer.printLine(' ')
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
    };
}
