const CLIENT_ID = "";
const CLIENT_SECRET = "";

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

  responseHTML.innerHTML = `Please copy this code:
    ${data.user_code} now and proceed to next step
  `;
};

const authButton = document.getElementById("auth-button");
const responseHTML = document.getElementById("response");

authButton.addEventListener("click", requestAuth);
