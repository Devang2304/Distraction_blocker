document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const statusDiv = document.getElementById('status');
  const optionsLink = document.getElementById('optionsLink');
  
  
  chrome.storage.sync.get({ enabled: true }, function(data) {
    updateUI(data.enabled);
  });
  
  toggleButton.addEventListener('click', function() {
    chrome.storage.sync.get({ enabled: true }, function(data) {
      const newState = !data.enabled;
      chrome.storage.sync.set({ enabled: newState }, function() {
        updateUI(newState);
        if (!newState) {
          chrome.runtime.sendMessage({ action: "postToTwitter" });
        }
      });
    });
  });
  
  optionsLink.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
  
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