const { shuffle, flatten } = require('./utils');
const PersonalityTextSummaries = require("personality-text-summary");

module.exports = function(data){
  console.log(data)

  const lang = data.lang.toUpperCase();
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
    const likely = flatten(
      market.map(function (c) {
        return c.preferences.filter(function (i) {
          return i.score == 1;
        });
      })
    ).slice(0, 5);

    const notLikely = flatten(
      market.map(function (c) {
        return c.preferences.filter(function (i) {
          return i.score == 0;
        });
      })
    ).slice(0, 5);

    return {
      likely: shuffle(likely).map(normalizeMarketString),
      notLikely: shuffle(notLikely).map(normalizeMarketString)
    };
  }


  var v3EnglishTextSummaries = new PersonalityTextSummaries({
    locale: "en",
    version: "v3"
  });
  var textSummary = v3EnglishTextSummaries.getSummary(data.raw);

  var personalityStrings = preparePersonality(data.facets);

  var market = prepareMarket(data.marketPreferences);

  var extremes = data.cached;

  return {
    identifier: data.identifier,
    personalityStrings,
    market,
    extremes,
  }

}