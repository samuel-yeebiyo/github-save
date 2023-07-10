const CLIENT_ID = "";
const CLIENT_SECRET = "";

const contentSection = document.getElementById("content");
const authTemplate = document.getElementById("auth-content");

let authenticated = false;
let shownNode = null;

(() => {
  // Check for user authentication to know which template to show
  console.log("appending template");
  if (!authenticated) {
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
  } else {
    let clone = withAuth.content.cloneNode(true);
    contentSection.appendChild(clone);
  }
})();

// Github Auth
const requestAuth = async () => {
  const response = await fetch(
    "https://cors-anywhere.herokuapp.com/https://github.com/login/device/code",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        scope: "user",
      }),
    }
  );
  const data = await response.json();
  console.log(data);

  window.open(data.verification_uri, "_blank");

  return data;
};

const authButton = document.getElementById("auth-button");

authButton.addEventListener("click", async () => {
  const { user_code, interval, expires_in } = await requestAuth();
  showUserCode(user_code);

  const pollingInterval = setInterval(() => {
    console.log("Polling");
    pollingAuthEndpoint(user_code);
  }, interval * 1500);

  const pollingAuthEndpoint = async (code) => {
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
        body: JSON.stringify({
          client_id: CLIENT_ID,
          device_code: code,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.access_token) {
      clearInterval(pollingInterval);
      return data.access_token;
    }
  };

  setTimeout(() => {
    clearInterval(pollingInterval);
  }, expires_in * 1000);
});

const showUserCode = async (user_code) => {
  // contentSection.removeChild(withoutAuth);
  const container = document.getElementById("auth-container");
  const messageEl = document.getElementById("auth-message");

  // show access token message
  messageEl.innerHTML = `Enter the device code displayed in order to complete authentication.
  You will be able to directed to the consent screen shortly after.`;

  // remove auth button
  const authButton = document.getElementById("auth-button");
  authButton.remove();

  // show user code
  const userCode = document.createElement("p");
  userCode.id = "user-code";
  userCode.innerHTML = user_code;
  container.appendChild(userCode);
};
