// Addding the Icon to the tool bar for easy access
const addIconToToolbar = () => {
  const actionHeader = document.querySelector(".AppHeader-actions");
  const iconDiv = document.getElementById("saved-button");
  if (!iconDiv && actionHeader) {
    const mainIcon = document.createElement("div");

    // Add the necessary classes to icon container
    mainIcon.classList.add("Button-withTooltip");
    mainIcon.id = "saved-button";

    // Add the icon and tool tip to icon container
    const link = `
      <a
        id="icon-button-33e21251-cdb2-40df-a14a-085584be45cf"
        data-view-component="true"
        class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted"
        aria-labelledby="tooltip-ccda957d-9ed3-4dbc-bea1-03c2634b16c6"
      >
        S
      </a>
    `;
    const tooltip = `
      <tool-tip
        id="tooltip-ccda957d-9ed3-4dbc-bea1-03c2634b16c6"
        for="icon-button-33e21251-cdb2-40df-a14a-085584be45cf"
        data-direction="s"
        data-type="label"
        data-view-component="true"
        class="position-absolute sr-only"
        aria-hidden="true"
        role="tooltip"
        style="left: -8.14167px; top: 42px;"
      >
        Github Save
      </tool-tip>
    `;

    mainIcon.innerHTML = `${link} ${tooltip}`;

    actionHeader.appendChild(mainIcon);
  }
};

const addIconToFileView = () => {
  const fileHeader = document.querySelector('[title="More file actions"]');
  const saveButton = document.getElementById("my-save-file");
  if (fileHeader && !saveButton) {
    const template = document.createElement("template");
    let saveIcon = `
      <button
        data-component="IconButton"
        aria-label="More file actions"
        class="types__StyledButton-sc-ws60qy-0 dXveNa js-blob-dropdown-click"
        title="Save file"
        data-testid="save-file"
        tabindex="0"
        data-no-visuals="true"
        id="my-save-file"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          class="octicon octicon-heart"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"
        >
          <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
        </svg>
      </button>
    `;
    saveIcon = saveIcon.trim();
    template.innerHTML = saveIcon;

    fileHeader.parentNode.insertBefore(
      template.content.firstChild,
      fileHeader.nextSibling
    );
  }
};

addIconToToolbar();
addIconToFileView();

const progressBarExists = () => {
  const bar = document.querySelector(".turbo-progress-bar");
  if (!bar) return false;
  return true;
};

let previousUrl = location.href;
let observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    console.log(`URL changed to ${location.href}`);

    const checkForProgressBar = () => {
      const exists = progressBarExists();
      if (!exists) {
        addIconToFileView();
        addIconToToolbar();
        clearProgressInterval();
      }
    };
    const loadingInterval = setInterval(checkForProgressBar, 1000);
    const clearProgressInterval = () => {
      clearInterval(loadingInterval);
    };
  }
});

const config = { subtree: true, childList: true };
observer.observe(document, config);

const injectScript = (file_path, tag) => {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
};

// This will inject this script tag to all tabs that have our target site opened
// This is useful when we want to access variables and data that are in the context of the webpage
injectScript(browser.runtime.getURL("injectable.js"), "body");

// Add an event listener to listen to mesage from the injected script to the background script
window.addEventListener(
  "message",
  (event) => {
    if (event.data.type && event.data.type == "LIKE_FILE") {
      console.log("Received message: ", event.data.likedFile);
      browser.runtime.sendMessage({
        context: "LIKE",
        likedFile: event.data.likedFile,
      });
    }
  },
  false
);
