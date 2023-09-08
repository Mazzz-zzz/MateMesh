// background.js
console.log("service worker added")

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    // process data here
    if (request.action === "executeScript") {
        chrome.scripting.executeScript({
            target: { tabId: request.tabId },
            files: [request.file]
        }, (results) => {
          // Handle the results of the script execution here
          console.log(results);
      });
    }
    // Send a response
    sendResponse({ success: true });
});

