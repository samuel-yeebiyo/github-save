const contentSection = document.getElementById("content");
const authTemplate = document.getElementById("auth-content");

// function to make request to server for user session.
const checkWithServer = async () => {
  const response = await fetch(
    "https://1bfb-41-139-17-82.ngrok-free.app/user",
    {
      method: "GET",
      mode: "cors",
      headers: {
        "X-CSRF-MITIGATION-GHS": 1,
        Accept: "application/json",
      },
    }
  );
  if (response.status !== 200) {
    return null;
  }
  const responseData = await response.json();
  console.log(responseData);
  return responseData;
};

// Show authenticated user the authed template
const showAuthedView = () => {
  window.location.href = "user.html";
};

// Show non-authenticated user the unauthed template
const showNonAuthView = () => {
  // show authorize prompt
  let clone = authTemplate.content.cloneNode(true);
  let message = clone.getElementById("auth-message");
  message.innerHTML = `Please authenticate using your GitHub account to start saving repo
files.`;

  // create authorize button
  const authButton = document.createElement("button");
  authButton.id = "auth-button";
  authButton.type = "button";
  authButton.innerHTML = "Authorize";

  // insert elements to DOM
  const container = clone.getElementById("auth-container");
  container.appendChild(authButton);
  contentSection.appendChild(clone);

  // attach event listener to auth button
  authButton.addEventListener("click", async () => {
    browser.runtime.sendMessage({
      context: "AUTH",
    });
  });
};

(async () => {
  let isAuthenticated = false;

  const authResponse = await checkWithServer();

  if (authResponse) {
    isAuthenticated = true;
  }

  if (isAuthenticated) {
    console.log("Authed");
    showAuthedView();
  } else {
    console.log("Not authed");
    // remove spinner
    const spinner = document.getElementById("spinner");
    spinner.remove();
    showNonAuthView();
  }
})();

// Copy to clipboard
// copyButton.addEventListener("click", () => {
//   navigator.clipboard.writeText(user_code);
//   copyButton.innerHTML = "Copied!";
// });

// Inject script into browser tab
// injectButton.addEventListener("click", function() {
//   browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
//     browser.scripting.executeScript({
//       target: { tabId: tabs[0].id },
//       files: ["content_script.js"]
//     });
//   });
// });

window.addEventListener("DOMContentLoaded", () => {
  let page = browser.extension.getBackgroundPage();
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTabId = tabs[0].id;
    let currentData = page.userData[currentTabId];

    console.log({ currentData });
  });
});
