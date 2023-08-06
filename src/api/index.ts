import axios from "axios";
import browser from "webextension-polyfill";

export const handleDelete = async (url: string, refetch: () => void) => {
  await axios
    .post(
      `https://api.githubsave.samuelyyy.com/like`,
      {
        likedFile: url,
      },
      {
        headers: {
          "X-CSRF-MITIGATION-GHS": "1",
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        withCredentials: true,
      }
    )
    .then(async ({ status }) => {
      if (status == 401) {
        throw Error("Authorization error");
      } else if (status == 200) {
        const allTabs = await browser.tabs.query({
          url: url,
        });
        if (allTabs.length > 0) {
          allTabs.map(async (tab) => {
            if (tab.id)
              await browser.tabs.sendMessage(tab.id, { message: "UNLIKE" });
          });
        }
        refetch();
      }
    });
};
