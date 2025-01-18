chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
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
  } else if (request.action === "OpenUserFiles") {
    const file_id = request.file_id;
    const url = `http://127.0.0.1:5000/fetch-title?file_id=${file_id}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Error fetching job details:", response.statusText);
      return;
    }

    // fetch("http://127.0.0.1:5000/fetch-title", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ fileId: file_id }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Title saved successfully:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error sending title to Flask backend:", error);
    //   });
  }
});
