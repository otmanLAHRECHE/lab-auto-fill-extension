let jsonData = null;

document.getElementById("jsonFile").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      jsonData = JSON.parse(e.target.result);
      alert("✅ JSON loaded successfully!");
    } catch (err) {
      alert("❌ Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});

document.getElementById("fillButton").addEventListener("click", () => {
  if (!jsonData) {
    alert("⚠️ Please load a JSON file first.");
    return;
  }

  // Send data to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "fillLabForm",
      data: jsonData
    });
  });
});
