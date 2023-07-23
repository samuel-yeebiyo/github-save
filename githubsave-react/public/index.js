const isLiked = async () => {
  const fileUrl = window.location.href;

  const checking = new Promise((resolve, reject) => {
    browser.runtime.sendMessage(
      {
        context: "CHECK",
        file: fileUrl,
      },
      (response) => {
        resolve(response);
      }
    );
  });

  return await checking.then((liked) => liked);
};

const updateLikedIcon = (liked, { withVisibilty }) => {
  const saveButton = document.getElementById("my-save-file");
  const heart = saveButton.getElementsByTagName("svg")[0];
  if (liked) {
    heart.style.fill = "rgba(255, 0, 0, 0.7)";
  } else heart.style.fill = "currentColor";
  if (withVisibilty) {
    saveButton.style.display = "block";
  }
};

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

    mainIcon.textContent = `${link} ${tooltip}`;

    actionHeader.appendChild(mainIcon);
  }
};

const addIconToFileView = async () => {
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
        style="display: none;"
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
          <path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path>
        </svg>
      </button>
    `;
    saveIcon = saveIcon.trim();
    template.innerHTML = saveIcon;

    console.log(template.content);

    fileHeader.parentNode.insertBefore(
      template.content.firstChild,
      fileHeader.nextSibling
    );

    const liked = await isLiked();
    updateLikedIcon(liked, { withVisibilty: true });
  }
};

// addIconToToolbar();
addIconToFileView();

const progressBarExists = () => {
  const bar = document.querySelector(".turbo-progress-bar");
  if (!bar) return false;
  return true;
};

const injectScript = (file_path, tag) => {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement("script");
  script.id = "ghs-script";
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
};

const dejectScript = () => {
  const script = document.getElementById("ghs-script");
  script.remove();
};

// This will inject this script tag to all tabs that have our target site opened
// This is useful when we want to access variables and data that are in the context of the webpage
injectScript(browser.runtime.getURL("injectable.js"), "body");

let previousUrl = location.href;
let observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    dejectScript();

    const checkForProgressBar = () => {
      const exists = progressBarExists();
      if (!exists) {
        addIconToFileView();
        addIconToToolbar();
        clearProgressInterval();
        injectScript(browser.runtime.getURL("injectable.js"), "body");
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

// Add an event listener to listen to mesage from the injected script to the background script
window.addEventListener(
  "message",
  (event) => {
    if (event.data.type && event.data.type == "LIKE_FILE") {
      browser.runtime.sendMessage(
        {
          context: "LIKE",
          likedFile: event.data.likedFile,
        },
        (response) => {
          if (response.type && response.type == "error") {
            alert(response.message);
          } else {
            if (response.removed) {
              updateLikedIcon(false, { withVisibilty: false });
            } else {
              updateLikedIcon(true, { withVisibilty: false });
            }
          }
        }
      );
    }
  },
  false
);
