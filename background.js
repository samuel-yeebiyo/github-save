window.dataWatch = {};

// Add a message listener to check for messages from the content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  window.dataWatch[sender.tab.id] = message.essential || null;
});
