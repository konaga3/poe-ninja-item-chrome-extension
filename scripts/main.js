function getStatJson() {
  fetch(chrome.runtime.getURL("../jsons/stat.json"))
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      statsData = json;
    });
}
function getItemJson() {
  return fetch(chrome.runtime.getURL("../jsons/item.json"))
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      itemData = json;
    });
}
function getDefaultJson() {
  return fetch(chrome.runtime.getURL("../jsons/default.json"))
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      defaultJson = json;
    });
}

const setInput = (text) => {
  const textList = text.split("\n");
  let forbiddenJewel;
  //console.log(textList);
  if (textList[0].includes("Rare")) {
    let j = 0;
    if (textList[textList.length - 1].includes("Item")) {
      if (textList[textList.length - 2] === "--------") {
        j = 2;
      }
    }
    for (let i = textList.length - 1 - j; i >= 0; i--) {
      //console.log(textList[i]);
      const temp = searchStats(numToHash(textList[i]), false);
      if (temp != null) {
        statsJson[0].filters.push(temp);
      }
    }
    jsonQuery.query.stats = JSON.parse(JSON.stringify(statsJson));
    //console.log(jsonQuery);
  } else if (textList[0].includes("Unique")) {
    if (
      !textList[1].includes("Forbidden Flame") &&
      !textList[1].includes("Forbidden Flesh")
    ) {
      jsonQuery.query.name = textList[1];
      if (textList[2].includes("Synthesised ")) {
        textList[2] = textList[2].replace("Synthesised ", "");
      }
      jsonQuery.query.type = textList[2];
    }
    for (let i = textList.length - 1; i >= 0; i--) {
      //console.log(textList[i]);
      if (textList[i].includes("if you have the matching modifier")) {
        const flesh = "Forbidden Flesh";
        const flame = "Forbidden Flame";
        forbiddenJewel = textList[i].slice(
          textList[i].length - 15,
          textList[i].length
        );
        if (flesh === forbiddenJewel) {
          forbiddenJewel =
            textList[i].slice(0, textList[i].length - 15) + flame;
        } else {
          forbiddenJewel =
            textList[i].slice(0, textList[i].length - 15) + flesh;
        }
        const temp1 = searchStats(numToHash(textList[i]), true);
        statsJson[0].filters.push(temp1);
        const temp2 = searchStats(numToHash(forbiddenJewel), false);
        statsJson[0].filters.push(temp2);
      } else {
        const temp = searchStats(numToHash(textList[i]), false);
        if (temp !== null) {
          statsJson[0].filters.push(temp);
        }
      }
    }
    jsonQuery.query.stats = JSON.parse(JSON.stringify(statsJson));
  } else if (textList[0].includes("Magic")) {
    alert("Not Yet");
    return;
  }
  //state.url += state.jsonQuery;
  return defaultUrl + JSON.stringify(jsonQuery);
};

function searchStats(text, select) {
  let id = "";
  let ascendancy = "";
  let keystone = "";
  if (text.includes("(crafted)")) {
    text = text.replace(" (crafted)", "");
    id = "crafted";
  } else if (text.includes("(enchant)")) {
    text = text.replace(" (enchant)", "");
    id = "enchant";
  } else if (text.includes("(fractured)")) {
    text = text.replace(" (fractured)", "");
    id = "fractured";
  } else if (text.includes("(implicit)")) {
    text = text.replace(" (implicit)", "");
    id = "implicit";
  } else {
    id = "explicit";
    if (text.includes("Added Passive Skill is")) {
      text = text.replace("#", "1");
    }
    if (text.includes("if you have the matching modifier")) {
      const flesh = "Forbidden Flesh";
      const flame = "Forbidden Flame";
      ascendancy = text.slice(10, text.indexOf(" if you have"));
      if (text.slice(text.length - 15, text.length) === flesh) {
        text = `Allocates # if you have matching modifier on ${flame}`;
      } else {
        text = `Allocates # if you have matching modifier on ${flesh}`;
      }
    }

    if (text.includes("Passives in Radius of")) {
      keystone = text.slice(22, text.indexOf(" can be Allocated"));
      //console.log(keystone);
      text =
        "Passives in Radius of # can be Allocated\nwithout being connected to your tree";
    }
  }

  for (let i = 0; i < 6; i++) {
    if (statsData.result[i].id === id) {
      for (let j = 0; j < statsData.result[i].entries.length; j++) {
        if (statsData.result[i].entries[j].text === text) {
          if (ascendancy !== "" || keystone !== "") {
            for (
              let k = 0;
              k < statsData.result[i].entries[j].option.options.length;
              k++
            ) {
              if (
                statsData.result[i].entries[j].option.options[k].text ===
                ascendancy
              ) {
                return {
                  id: statsData.result[i].entries[j].id,
                  value: {
                    option: statsData.result[i].entries[j].option.options[k].id,
                  },
                  disabled: select,
                };
              }
              if (
                statsData.result[i].entries[j].option.options[k].text ===
                keystone
              ) {
                return {
                  id: statsData.result[i].entries[j].id,
                  value: {
                    option: statsData.result[i].entries[j].option.options[k].id,
                  },
                  disabled: select,
                };
              }
            }
          }
          return { id: statsData.result[i].entries[j].id, disabled: select };
        }
      }
    }
  }
  return null;
}

function numToHash(text) {
  const regex = /[0-9]/g;
  text = text.replaceAll(regex, "#");
  text = text.replaceAll("###", "#");
  text = text.replaceAll("##", "#");
  text = text.replaceAll("+", "");
  return text;
}

var statsData;
var itemData;
var defaultJson;

getStatJson();
getItemJson();
getDefaultJson();

var statsJson;
var filtersJson;
var jsonQuery;

const league = location.href.split('/')[4];
let leagueURL;
if(league === 'challenge' || league === 'challengessf'){
  leagueURL = 'Crusible';
}
else if(league.includes('hc')){
  leagueURL = 'Hardcore%20Crucible';
}
const defaultUrl = `https://www.pathofexile.com/trade/search/${leagueURL}?q=`;

let body = document.querySelector("#main");
let textarea = document.createElement("textarea");
textarea.type = "text";
textarea.rows = "2";
textarea.cols = "50";
body.prepend(textarea);

let btn = document.createElement("button");
btn.innerHTML = "URL生成";

btn.onclick = () => {
  statsJson = JSON.parse(JSON.stringify(defaultJson.stats));
  filtersJson = JSON.parse(JSON.stringify(defaultJson.filters));
  jsonQuery = { query: JSON.parse(JSON.stringify(defaultJson.query)) };

  const completeUrl = setInput(textarea.value);
  if (completeUrl !== undefined) {
    console.log(completeUrl);
    window.open(completeUrl);
  }
  textarea.value = "";
};

let target = document.getElementById("main");
target.appendChild(btn);
