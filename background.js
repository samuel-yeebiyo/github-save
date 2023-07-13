window.likedFile = {};
window.userData = {};

// Add a message listener to check for messages from the content script
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.context) {
    case "LIKE":
      window.likedFile[sender.tab.id] = message.likedFile || null;

      const response = await fetch(
        "https://1bfb-41-139-17-82.ngrok-free.app/like",
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
      const responseData = await response.json();
      console.log(responseData);
      break;
    case "AUTH":
      console.log("Authentication message");
      const userData = await authFlow();
      if (userData) {
        window.userData = userData;
      }
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
  const response = await fetch(
    "https://1bfb-41-139-17-82.ngrok-free.app/auth",
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
  console.log(responseData);
  return responseData;
};
