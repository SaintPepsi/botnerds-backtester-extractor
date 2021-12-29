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

let FORMAT_REGULAR = "FORMAT_REGULAR";
let FORMAT_PER_TEST = "FORMAT_PER_TEST";

let formatting_enum = FORMAT_PER_TEST;

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
  let [pair, test_index] = title.innerText
    .split("Summary Results for ")[1]
    .split(" Test ");

  let collected_data = {
    pair,
    test_index,
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

      // Is it a number? parse it as float, otherwise leave it.
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

switch (formatting_enum) {
  case FORMAT_REGULAR:
    // Download final data as json file - Regular format
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(allCollectedData));
    var dlAnchorElem = document.createElement("a");

    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "data_regular.json");
    dlAnchorElem.click();
    break;

  case FORMAT_PER_TEST:
    // Format document per test
    let final_object = {};

    allCollectedData.forEach((data) => {
      let test_id = `test_${data.test_index}`;
      if (!final_object[test_id]) {
        final_object[test_id] = [];
      }

      final_object[test_id].push(data);
    });

    console.log("quote_pair_data", final_object);

    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(final_object));
    var dlAnchorElem = document.createElement("a");

    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "data_per_test.json");
    dlAnchorElem.click();

    break;

  default:
    break;
}
