chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Lab Auto-Fill Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "log") {
    console.log("🔍 Background Log:", message.data);
  }
});