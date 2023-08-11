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
  const saveButtonWide = document.getElementById("my-save-file1");
  const saveButtonNarrow = document.getElementById("my-save-file2");

  if (saveButtonWide) {
    const heartWide = saveButtonWide.getElementsByTagName("svg")[0];
    if (heartWide) {
      if (liked) {
        heartWide.style.fill = "rgba(255, 0, 0, 0.7)";
      } else heartWide.style.fill = "currentColor";
      if (withVisibilty) {
        saveButtonWide.style.display = "block";
      }
    }
  }
  if (saveButtonNarrow) {
    const heartNarrow = saveButtonNarrow.getElementsByTagName("svg")[0];
    if (heartNarrow) {
      if (liked) {
        heartNarrow.style.fill = "rgba(255, 0, 0, 0.7)";
      } else heartNarrow.style.fill = "currentColor";
      if (withVisibilty) {
        saveButtonNarrow.style.display = "block";
      }
    }
  }
};

// Work around for using the innerHTML for elements like these
const generateSaveSvg = () => {
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("aria-hidden", "true");
  svgIcon.setAttribute("focusable", "false");
  svgIcon.setAttribute("role", "img");
  svgIcon.setAttribute("class", "octicon octicon-heart");
  svgIcon.setAttribute("viewBox", "0 0 16 16");
  svgIcon.setAttribute("width", "16");
  svgIcon.setAttribute("height", "16");
  svgIcon.setAttribute("fill", "currentColor");
  svgIcon.setAttribute(
    "style",
    "display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"
  );

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"
  );

  svgIcon.appendChild(path);
  return svgIcon;
};

const addIconToFileView = async () => {
  const codeViewWider = document.querySelector(".react-code-view-header--wide");
  const codeViewNarrow = document.querySelector(
    ".react-code-view-header--narrow"
  );

  if (codeViewWider) {
    const fileHeaderButtonWide = codeViewWider.querySelector(
      '[title="More file actions"]'
    );

    const saveButtonWide = document.getElementById("my-save-file1");
    if (!saveButtonWide && fileHeaderButtonWide) {
      // wide
      const templateWide = document.createElement("template");

      const saveButtonWide = fileHeaderButtonWide.cloneNode();

      saveButtonWide.id = "my-save-file1";
      saveButtonWide.setAttribute("title", "Save file");
      const saveSVG = generateSaveSvg();
      saveButtonWide.appendChild(saveSVG);

      templateWide.appendChild(saveButtonWide);

      fileHeaderButtonWide.parentNode.insertBefore(
        templateWide.firstChild,
        fileHeaderButtonWide.nextSibling
      );
    }
  }
  if (codeViewNarrow) {
    const fileHeaderButtonNarrow = codeViewNarrow.querySelector(
      '[title="More file actions"]'
    );

    const saveButtonNarrow = document.getElementById("my-save-file2");

    if (!saveButtonNarrow && fileHeaderButtonNarrow) {
      // Narrow
      const templateNarrow = document.createElement("template");

      const saveButtonNarrow = fileHeaderButtonNarrow.cloneNode();

      saveButtonNarrow.id = "my-save-file2";
      saveButtonNarrow.setAttribute("title", "Save file");
      const saveSVG = generateSaveSvg();
      saveButtonNarrow.appendChild(saveSVG);

      templateNarrow.appendChild(saveButtonNarrow);

      fileHeaderButtonNarrow.parentNode.insertBefore(
        templateNarrow.firstChild,
        fileHeaderButtonNarrow.nextSibling
      );
    }
  }

  const liked = await isLiked();
  updateLikedIcon(liked, { withVisibilty: true });
};

addIconToFileView();

const removeLikeIcon = async () => {
  const saveButton = document.getElementById("my-save-file");
  if (saveButton) {
    saveButton.remove();
  }
};

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
    removeLikeIcon();

    const checkForProgressBar = () => {
      const exists = progressBarExists();
      if (!exists) {
        addIconToFileView();
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

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "UNLIKE") {
    updateLikedIcon(false, { withVisibilty: false });
  }
});
