let jsonData = null;

document.getElementById('loadBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    showStatus('❌ Please select a JSON file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      jsonData = JSON.parse(e.target.result);
      showStatus('✅ JSON loaded successfully.');
      document.getElementById('fillBtn').disabled = false;
    } catch (err) {
      showStatus('❌ Invalid JSON file.');
    }
  };
  reader.readAsText(file);
});

document.getElementById('fillBtn').addEventListener('click', () => {
  if (!jsonData) return;

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillForm,
      args: [jsonData]
    }, () => {
      showStatus('✅ Attempted to fill form. Check page.');
    });
  });
});

function showStatus(message) {
  document.getElementById('status').textContent = message;
}

// This function will be injected into the page
function fillForm(data) {
  for (const [key, value] of Object.entries(data)) {
    let found = false;

    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
      const rowText = row.textContent?.toLowerCase();
      if (!rowText || !rowText.includes(key.toLowerCase())) return;

      const inputs = row.querySelectorAll('input');
      for (const input of inputs) {
        const id = input.id?.toLowerCase() || '';
        const name = input.name?.toLowerCase() || '';
        const isResultField = id.startsWith('res') || name.startsWith('res');

        if (isResultField && !input.readOnly && input.type !== 'hidden') {
          input.value = value;
          input.style.border = '2px solid green';
          found = true;
          break;
        }
      }
    });

    if (!found) {
      console.warn(`⚠️ Could not find a result input for: ${key}`);
    }
  }
}
