(() => {
  let likeButton = document.getElementById("my-save-file");

  if (likeButton) {
    likeButton.addEventListener("click", () => {
      let likedFile = window.location.href;
      console.log("Sending message");
      window.postMessage({ type: "LIKE_FILE", likedFile });
    });
  }
})();
