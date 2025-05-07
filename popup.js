document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const statusDiv = document.getElementById('status');
  const optionsLink = document.getElementById('optionsLink');
  
  // Load current state
  chrome.storage.sync.get({ enabled: true }, function(data) {
    updateUI(data.enabled);
  });
  
  // Toggle blocking state
  toggleButton.addEventListener('click', function() {
    chrome.storage.sync.get({ enabled: true }, function(data) {
      const newState = !data.enabled;
      chrome.storage.sync.set({ enabled: newState }, function() {
        updateUI(newState);
      });
    });
  });
  
  // Open options page
  optionsLink.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
  
  // Update UI based on state
  function updateUI(enabled) {
    if (enabled) {
      statusDiv.textContent = 'Blocking is currently enabled';
      statusDiv.className = 'status enabled';
      toggleButton.textContent = 'Disable Blocking';
    } else {
      statusDiv.textContent = 'Blocking is currently disabled';
      statusDiv.className = 'status disabled';
      toggleButton.textContent = 'Enable Blocking';
    }
  }
});