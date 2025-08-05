chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillLabForm" && request.data) {
    fillForm(request.data);
  }
});

// Try to find inputs and fill them
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

        // Only fill input if it's a result input (not observation, etc.)
        const isResultField =
          id.startsWith('res') || name.startsWith('res');

        if (
          isResultField &&
          !input.readOnly &&
          input.type !== 'hidden'
        ) {
          input.value = value;
          input.style.border = '2px solid green';
          console.log(`✅ Filled "${key}" in input with id="${input.id}"`);
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


// Try to get the text of the label associated with a given input
function getLabelTextForInput(input) {
  // Check <label for="input_id">
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.innerText;
  }

  // Check if parent <label> wraps the input
  let parent = input.closest('label');
  if (parent) return parent.innerText;

  // Check previous sibling (some forms put label just above input)
  let prev = input.previousElementSibling;
  if (prev && prev.tagName.toLowerCase() === 'label') {
    return prev.innerText;
  }

  return null;
}

