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
    fetch("http://127.0.0.1:5000/save-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: pageTitle }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Title saved successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending title to Flask backend:", error);
      });
  }
});
