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
