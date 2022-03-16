const STORAGE_KEY = "user-color-scheme";
const COLOR_MODE_KEY = "--color-mode"; // COLOR_MODE_KEY is what we use to extract the current CSS Custom Property value, --color-mode
const checkboxEl = document.getElementById("toggle");

// document.documentElement selects html element
//  let’s add a function to extract the --color-mode value:
const getCSSCustomProp = (propKey) => {
  let response = getComputedStyle(document.documentElement).getPropertyValue(
    propKey
  );

  if (response.length) {
    response = response.replace(/\"/g, "").trim();
  }

  return response;
};

//  code that toggles the colour mode:
const toggleSetting = () => {
  let currentSetting = localStorage.getItem(STORAGE_KEY);

  switch (currentSetting) {
    case null:
      currentSetting =
        getCSSCustomProp(COLOR_MODE_KEY) === "dark" ? "light" : "dark";
      break;
    case "light":
      currentSetting = "dark";
      break;
    case "dark":
      currentSetting = "light";
      break;
  }

  localStorage.setItem(STORAGE_KEY, currentSetting);

  return currentSetting;
};

//  Next, let’s add a function that applies the user preference that’s either set in local storage or passed in:
const applySetting = (passedSetting) => {
  let currentSetting = passedSetting || localStorage.getItem(STORAGE_KEY);

  if (currentSetting) {
    document.documentElement.setAttribute("data-theme", currentSetting);
    if (currentSetting === "light") {
      checkboxEl.checked = false;
    } else if (currentSetting === "dark") {
      checkboxEl.checked = true;
    }
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    checkboxEl.checked = false;
  }
};

checkboxEl.addEventListener("change", handleCheckboxChange);

function handleCheckboxChange() {
  console.log("change happened");
  applySetting(toggleSetting());
}

// We run applySetting() by default to make sure that the user’s preference is applied on page load.
applySetting();
