const contentSection = document.getElementById("content");
const containerTemplate = document.getElementById("liked-content");

// function to make request to server for user session.
const getLikedFiles = async () => {
  const response = await fetch(
    "https://1bfb-41-139-17-82.ngrok-free.app/likes",
    {
      method: "GET",
      mode: "cors",
      headers: {
        "X-CSRF-MITIGATION-GHS": 1,
        Accept: "application/json",
      },
    }
  );
  if (response.status !== 200) {
    return null;
  }
  const responseData = await response.json();
  return responseData;
};

(async () => {
  const likedFiles = await getLikedFiles();

  // remove spinner
  const spinner = document.getElementById("spinner");
  spinner.remove();

  if (likedFiles && likedFiles.length > 0) {
    let clone = containerTemplate.content.cloneNode(true);
    let container = clone.getElementById("liked-container");
    likedFiles.forEach((file) => {
      let fileTemplate = clone.getElementById("liked-file");
      let fileClone = fileTemplate.content.cloneNode(true);
      // get template parts
      let repo = fileClone.querySelector(".file-repo");
      let name = fileClone.querySelector(".file-name");
      let link = fileClone.querySelector(".file-link");
      // set template values
      repo.innerHTML = file.repoName;
      name.innerHTML = file.fileName;
      link.innerHTML = file.url;
      link.setAttribute("href", file.url);
      container.appendChild(fileClone);
    });
    contentSection.appendChild(clone);
  }
})();
