// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "downloadCSV") {
//     const { csvContent, filename } = request;
//     chrome.downloads.download({
//       url: "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent),
//       filename: filename || "job_data.csv",
//       saveAs: true,
//     });
//     sendResponse({ success: true });
//   } else if (request.type === "updateCSV") {
//   }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendTitle") {
    const pageTitle = request.title;
    const pageUrl = request.url;
    const jobData = request.data;

    fetch("http://127.0.0.1:5000/save-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: pageTitle, url: pageUrl, data: jobData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Title saved successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending title to Flask backend:", error);
      });
  } else if (request.action === "openJobTrackerFile") {
    fetch("http://127.0.0.1:5000/fetch-title")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    window.open("http://127.0.0.1:5000/fetch-title", "_blank");
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
