(() => {
  let likeButtonWide = document.getElementById("my-save-file1");
  let likeButtonNarrow = document.getElementById("my-save-file2");

  if (likeButtonWide) {
    likeButtonWide.addEventListener("click", () => {
      let likedFile = window.location.href;
      window.postMessage({ type: "LIKE_FILE", likedFile });
    });
  }
  if (likeButtonNarrow) {
    likeButtonNarrow.addEventListener("click", () => {
      let likedFile = window.location.href;
      window.postMessage({ type: "LIKE_FILE", likedFile });
    });
  }
})();
