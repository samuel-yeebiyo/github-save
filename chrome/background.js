const asyncFunctionWithAwait = async (message, sender, sendResponse) => {
  switch (message.context) {
    case "AUTH":
      const userData = await authFlow();
      if (userData) {
        return sendResponse({
          authed: true,
        });
      } else {
        return sendResponse({ authed: false });
      }
      break;
    case "DEAUTH":
      const logoutResponse = await fetch(
        "https://073e-41-139-17-82.ngrok-free.app/logout",
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
        return sendResponse(true);
      } else {
        return sendResponse(false);
      }
      break;
    case "LIKE":
      const likeResponse = await fetch(
        "https://073e-41-139-17-82.ngrok-free.app/like",
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
          return sendResponse({
            type: "error",
            message: `Authorization error encountered.\nPlease make sure you are signed in.`,
          });
        } else {
          return sendResponse({
            type: "error",
            message: "Server error encountered, please try again later.",
          });
        }
      }
      const likeResponseData = await likeResponse.json();
      return sendResponse(likeResponseData);
      break;
    case "CHECK":
      const checkResponse = await fetch(
        "https://073e-41-139-17-82.ngrok-free.app/like/check",
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
      return sendResponse(checkResponseData.liked);
  }
};

// Add a message listener to check for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  asyncFunctionWithAwait(message, sender, sendResponse);
  return true;
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
  const redirectURL = chrome.identity.getRedirectURL();
  const CLIENT_ID = "26e7a126ddb4af8dd7c2";

  const scopes = ["user"];
  let authURL = "https://github.com/login/oauth/authorize";
  authURL += `?client_id=${CLIENT_ID}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;

  return chrome.identity.launchWebAuthFlow({
    interactive: interactive,
    url: authURL,
  });
};

const sendCodeToServer = async (data) => {
  const code = data.split("?")[1].split("=")[1];
  const response = await fetch(
    "https://073e-41-139-17-82.ngrok-free.app/auth",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        code: code,
      }),
    }
  );
  if (response.status !== 200) {
    return null;
  }

  const responseData = await response.json();
  return responseData;
};
