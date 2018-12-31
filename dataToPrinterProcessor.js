const { shuffle, flatten } = require('./utils');
const PersonalityTextSummaries = require("personality-text-summary");

module.exports = function(data){
  console.log(data)

  const lang = data.lang.toUpperCase();
  function preparePersonality(personality) {
    return personality.map(p => {
      const name = ((lang == "FR") ? p.fr_name : p.name)
      const score = String(p.score * 100).substring(0, 4)
      return `${name} - ${score}%`
    });
  }

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

  function prepareCorePhrase(elem) {
    let {phrase, facet_normalized} = elem;
    const score = String(elem.score * 100).substring(0, 4);
    if (/fr/i.test(lang)) {
      facet_normalized = elem.facet_normalized_fr;
      phrase = elem.fr_phrase
    }
    return `${facet_normalized} - ${phrase} - ${score}%`
  }

  // var v3EnglishTextSummaries = new PersonalityTextSummaries({
  //   locale: "en",
  //   version: "v3"
  // });
  // const textSummary = v3EnglishTextSummaries.getSummary(data.raw);
  const personalityStrings = preparePersonality(data.facets);
  const market = prepareMarket(data.marketPreferences);
  const extremes = data.cached.map(prepareCorePhrase);

  return {
    lang,
    identifier: data.identifier,
    personalityStrings,
    market,
    extremes,
  }
}