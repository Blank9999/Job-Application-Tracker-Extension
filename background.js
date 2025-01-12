chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addToNewFile") {
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
  }
});
