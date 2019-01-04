
const i18n = require('./i18n');


// large logo
// const logo = "./cachedRRR.png";
const logo = "./cached_elsewhere.png";

module.exports = function({ lang, identifier, personalityStrings, extremes, market }, printer, callback) {
    initFormats();
    console.log("Start of printing instructions for ", identifier);
    printer.left()
    printEmptyLines(8)
    printer.printImage(logo)
    printEmptyLines(5)
    printer.horizontalLine(33)
    printEmptyLines(3)
    
    // Intro
    printer
        .center()
        // .big(true)
        .printLine(" www.cached.id ")
        // .big(false)
        .printLine(" ")
    
        // Name
    printer
        .bold(false)
        .big(true)
        .inverse(true)
        .printLine(" " + identifier + " ")
        .inverse(false);
    
    // Core Traits
    printTitle(i18n.coreTraits[lang]);
    printArray(personalityStrings)
    printer.printLine(" ").horizontalLine(33).printLine(" ")
    // Extreme Characteristics
    printTitle(i18n.extreme[lang])
    printArray(extremes)
    printer.printLine(" ").horizontalLine(33).printLine("   ")
    // Market Preferences
    printTitle(i18n.likely[lang])
    printArray(market.likely)
    printTitle(i18n.notLikely[lang])
    printArray(market.notLikely)
    
    // End
    printer
        .printLine(" ")
        // .printSodexoDrinks(); 
        .small(true)
        .center()
        .printLine("Thank you for trusting us.")
        printEmptyLines(10)

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