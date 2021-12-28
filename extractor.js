let dataDict = {
  settings: "Settings",
  dailyROI: "Daily ROI (Closed)",
  profit: "Profit (Closed)",
  maxFundsUsed: "Max Funds Used",
  maxDrawdown: "Max Drawdown",
  drawdownConv: "Drawdown Cov.",
  totalFundsRequired: "Total Funds Req.",
  averageDealTime: "Avg Deal Time",
  maxDealTime: "Max Deal Time",
  tradesClosed: "Trades Closed",
};

let dataToGrab = {
  settings: true,
  dailyROI: true,
  profit: true,
  maxFundsUsed: true,
  maxDrawdown: true,
  drawdownConv: true,
  totalFundsRequired: true,
  averageDealTime: true,
  maxDealTime: true,
  tradesClosed: true,
};

let convertToNumber = [
  "dailyROI",
  "profit",
  "maxFundsUsed",
  "maxDrawdown",
  "drawdownConv",
  "totalFundsRequired",
  "tradesClosed",
];

let userName = "SanCoca";
let new_msg_divider = document.querySelector("#---new-messages-bar");

let current_element = new_msg_divider;

let allCollectedData = [];

function gatherData(currentEl) {
  // Get the grid stats summary
  let stats_summary = currentEl.querySelector(".grid-1nZz7S");

  // Get the title element of the summary (Contains pairs + iteration)
  let title = stats_summary.querySelectorAll(
    "[class*='embedTitle']",
  )[0];

  // Get the fields of the summary
  let fields = stats_summary.querySelectorAll(
    "[class*='embedFields']",
  )[0];

  // Get all relevant titles for fields
  let all_field_titles = fields.querySelectorAll(
    "[class*='embedFieldName']",
  );

  // Data collection object
  let collected_data = {
    title: title.innerText,
  };

  for (const key in dataToGrab) {
    if (dataToGrab[key]) {
      let title_string = dataDict[key];
      let title_dom;

      for (let i = 0; i < all_field_titles.length; i++) {
        title_dom = all_field_titles[i];
        if (title_dom.innerHTML === title_string) {
          break;
        }
      }

      let data_text = title_dom.nextElementSibling.innerText;
      collected_data[key] = convertToNumber.includes(key)
        ? parseFloat(data_text)
        : data_text;
    }
  }

  allCollectedData.push(collected_data);
}

// Recursive function to select next data message
function selectNextMessage(currentEl) {
  let next_message = currentEl.nextElementSibling;
  if (!next_message) return;

  // If can't find embed fields return with next message
  // If Author name is not the same as the user we are looking for return to next message
  if (
    next_message.querySelectorAll("[class*='embedFields']").length <=
      0 ||
    next_message.querySelector("[class*='embedAuthorName']")
      .innerText !== userName
  ) {
    // return;
    return selectNextMessage(next_message);
  }

  gatherData(next_message);

  return selectNextMessage(next_message);
}

// Collect all data
selectNextMessage(current_element);

console.log("allCollectedData", allCollectedData);

// Download final data as json file
var dataStr =
  "data:text/json;charset=utf-8," +
  encodeURIComponent(JSON.stringify(allCollectedData));
var dlAnchorElem = document.createElement("a");

dlAnchorElem.setAttribute("href", dataStr);
dlAnchorElem.setAttribute("download", "data.json");
dlAnchorElem.click();
