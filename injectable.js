(() => {
  let authorizationButton = document.getElementById("my-save-file");

  if (authorizationButton) {
    authorizationButton.addEventListener("click", () => {
      let essential = "some piece of data";
      console.log("Sending message");
      window.postMessage({ type: "FROM_PAGE", essential });
    });
  }
})();
