const STORAGE_KEY = "user-color-scheme";
const checkboxEl = document.getElementById("toggle");

const getInitialTheme = () => {
  const storedPrefs = localStorage.getItem(STORAGE_KEY);

  if (typeof storedPrefs === "string") return storedPrefs;

  // If no Prefernece stored. Get system preference
  const userMedia = window.matchMedia("prefers-color-scehme:dark");

  if (userMedia.matches) return "dark";

  // If both fails return default theme.. i.e :"light"
  return "light";
};

//  code that toggles the colour mode:
const toggleSetting = () => {
  let currentSetting = getInitialTheme();

  switch (currentSetting) {
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

const applySetting = (passedSetting) => {
  let currentSetting = passedSetting || getInitialTheme();

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

checkboxEl.addEventListener("change", () => {
  applySetting(toggleSetting());
});

// We run applySetting() by default to make sure that the user’s preference is applied on page load.
applySetting();
