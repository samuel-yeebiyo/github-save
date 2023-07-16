window.likedFile = {};
window.userData = {};

// Add a message listener to check for messages from the content script
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.context) {
    case "AUTH":
      const userData = await authFlow();
      if (userData) {
        return Promise.resolve({
          authed: true,
        });
      } else {
        return Promise.resolve({ authed: false });
      }
      break;
    case "DEAUTH":
      const logoutResponse = await fetch(
        "https://githubsave.samuelyyy.com/logout",
        {
          method: "POST",
          headers: {
            "X-CSRF-MITIGATION-GHS": 1,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
          credentials: "include",
        }
      );
      if (logoutResponse.status == 200) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
      break;
    case "LIKE":
      window.likedFile[sender.tab.id] = message.likedFile || null;

      const likeResponse = await fetch(
        "https://githubsave.samuelyyy.com/like",
        {
          method: "POST",
          headers: {
            "X-CSRF-MITIGATION-GHS": 1,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
          credentials: "include",
          body: JSON.stringify({
            likedFile: message.likedFile,
          }),
        }
      );
      if (likeResponse.status !== 200) {
        // Error handling
        if (likeResponse.status == 401) {
          return Promise.resolve({
            type: "error",
            message: `Authorization error encountered.\nPlease make sure you are signed in.`,
          });
        } else {
          return Promise.resolve({
            type: "error",
            message: "Server error encountered, please try again later.",
          });
        }
      }
      const likeResponseData = await likeResponse.json();
      return Promise.resolve(likeResponseData);
      break;
    case "CHECK":
      const checkResponse = await fetch(
        "https://githubsave.samuelyyy.com/like/check",
        {
          method: "POST",
          headers: {
            "X-CSRF-MITIGATION-GHS": 1,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
          credentials: "include",
          body: JSON.stringify({
            fileUrl: message.file,
          }),
        }
      );
      const checkResponseData = await checkResponse.json();
      return Promise.resolve(checkResponseData.liked);
  }
});

const authFlow = async () => {
  try {
    const authResponseCode = await requestAuth({ interactive: false });
    const userData = await sendCodeToServer(authResponseCode);
    return userData;
  } catch (e) {
    return requestAuth({ interactive: true })
      .then(async (data) => {
        const userData = await sendCodeToServer(data);
        return userData;
      })
      .catch((e) => {
        // send back error message
        console.log("Error encountered during authentication ", e);
        return null;
      });
  }
};

// Auth functions
const requestAuth = async ({ interactive }) => {
  const redirectURL = browser.identity.getRedirectURL();
  const CLIENT_ID = "26e7a126ddb4af8dd7c2";

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

const sendCodeToServer = async (data) => {
  const code = data.split("?")[1].split("=")[1];
  const response = await fetch("https://githubsave.samuelyyy.com/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      code: code,
      platform: "firefox",
    }),
  });
  if (response.status !== 200) {
    return null;
  }

  const responseData = await response.json();
  return responseData;
};
