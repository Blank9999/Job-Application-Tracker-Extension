chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "downloadCSV") {
    const { csvContent, filename } = request;
    chrome.downloads.download({
      url: "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent),
      filename: filename || "job_data.csv",
      saveAs: true,
    });
    sendResponse({ success: true });
  } else if (request.type === "updateCSV") {
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "pageData") {
    console.log("Received page data from content.js:");
    console.log("Title:", message.title);
    console.log("URL:", message.currentURL);

    // You can perform further actions with the data here

    // Send a response back to content.js
    sendResponse({ success: true });
  }
});