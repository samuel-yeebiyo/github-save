const CLIENT_ID = "";
const CLIENT_SECRET = "";

const contentSection = document.getElementById("content");
const authTemplate = document.getElementById("auth-content");

const requestAuth = async ({ interactive }) => {
  const redirectURL = browser.identity.getRedirectURL();

  const scopes = ["user"];
  let authURL = "https://github.com/login/oauth/authorize";
  authURL += `?client_id=${CLIENT_ID}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;

  return browser.identity.launchWebAuthFlow({
    interactive: interactive,
    url: authURL,
  });
};

async function getAccessToken() {
  return requestAuth({ interactive: true }).then(async (data) => {
    await fetchAccessToken(data);
  });
}

const fetchAccessToken = async (data) => {
  const code = data.split("?")[1].split("=")[1];
  const payload = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
  };

  // const res = await fetch("https://a6f3-41-139-17-82.ngrok-free.app/user", {
  //   method: "POST",
  //   mode: "cors",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //   body: JSON.stringify(payload),
  // });

  // console.log(res);

  const response = await fetch(
    "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  const responseData = await response.json();
  console.log(responseData);
  return responseData;
};

(async () => {
  let isAuthenticated = false;
  let auth = null;
  try {
    auth = await requestAuth({ interactive: false });
    console.log({ auth });

    let token = null;

    if (token) isAuthenticated = true;
    else {
      const response = await fetchAccessToken(auth);
      const item = { token: response.access_token };
      console.log(item);
      await browser.storage.local.set(item);
    }
  } catch (e) {
    console.log(e);
    isAuthenticated = false;
  }

  // remove spinner
  const spinner = document.getElementById("spinner");
  spinner.remove();

  // Check for user authentication to know which template to show
  if (!isAuthenticated) {
    // show authorize prompt
    let clone = authTemplate.content.cloneNode(true);
    let message = clone.getElementById("auth-message");
    message.innerHTML = `Please authenticate using your GitHub account to start saving repo
    files.`;
    const authButton = document.createElement("button");
    authButton.id = "auth-button";
    authButton.type = "button";
    authButton.innerHTML = "Authorize";

    const container = clone.getElementById("auth-container");
    container.appendChild(authButton);
    contentSection.appendChild(clone);

    authButton.addEventListener("click", async () => {
      await getAccessToken();
    });
  } else {
    let clone = authTemplate.content.cloneNode(true);
    let message = clone.getElementById("auth-message");
    message.innerHTML = `You have been authenticated!`;
    contentSection.appendChild(clone);
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
    let currentData = page.dataWatch[currentTabId];

    console.log({ currentData });
  });
});
