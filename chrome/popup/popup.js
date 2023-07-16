const contentSection = document.getElementById("content");
const authTemplate = document.getElementById("auth-content");
const userTemplate = document.getElementById("user-content");

// function to make request to server for user session.
const checkWithServer = async () => {
  const response = await fetch("https://githubsave.samuelyyy.com/user", {
    method: "GET",
    mode: "cors",
    headers: {
      "X-CSRF-MITIGATION-GHS": 1,
      Accept: "application/json",
    },
  });
  if (response.status !== 200) {
    return null;
  }
  const responseData = await response.json();
  return responseData;
};

// Show authenticated user the authed template
const showAuthedView = (userData) => {
  const clone = userTemplate.content.cloneNode(true);
  // <img src="" id="user-avatar" alt="user avatar" />
  let avatar = clone.getElementById("user-avatar");
  avatar.setAttribute("src", userData.avatar);
  let username = clone.getElementById("user-name");
  username.textContent = userData.name;
  let likedCounter = clone.getElementById("liked-counter");
  likedCounter.textContent = `You have ${userData.likes.length} liked files`;

  let signoutButton = clone.getElementById("sign-out");
  signoutButton.addEventListener("click", async () => {
    const deauthenticating = new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          context: "DEAUTH",
        },
        (response) => {
          resolve(response);
        }
      );
    });

    const deauthed = await deauthenticating.then((res) => res);
    if (deauthed) {
      window.location.reload();
    }
  });

  contentSection.appendChild(clone);
};

// Show non-authenticated user the unauthed template
const showNonAuthView = () => {
  // show authorize prompt
  let clone = authTemplate.content.cloneNode(true);
  let message = clone.getElementById("auth-message");
  message.textContent = `Please authenticate using your GitHub account to start saving repo
files.`;

  // create authorize button
  const authButton = document.createElement("button");
  authButton.id = "auth-button";
  authButton.type = "button";
  authButton.textContent = "Authorize";

  // insert elements to DOM
  const container = clone.getElementById("auth-container");
  container.appendChild(authButton);
  contentSection.appendChild(clone);

  // attach event listener to auth button
  authButton.addEventListener("click", async () => {
    const authenticating = new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          context: "AUTH",
        },
        (response) => {
          resolve(response.authed);
        }
      );
    });

    const authed = await authenticating.then((liked) => liked);

    if (authed) {
      window.location.reload();
    } else {
      const authButton = document.getElementById("auth-button");
      authButton.remove();
      const authMessage = document.getElementById("auth-message");
      authMessage.textContent = "Authentication failed please try again!";
    }
  });
};

(async () => {
  let isAuthenticated = false;

  const authResponse = await checkWithServer();

  if (authResponse) {
    isAuthenticated = true;
  }

  // remove spinner
  const spinner = document.getElementById("spinner");
  spinner.remove();

  if (isAuthenticated) {
    showAuthedView(authResponse);
  } else {
    showNonAuthView();
  }
})();
