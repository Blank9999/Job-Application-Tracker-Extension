

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "addToNewFile") {
    // const pageTitle = request.title;
    // const pageUrl = request.url;
    // const jobData = request.data;
    
    
    // fetch("http://127.0.0.1:5000/save-title", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ title: pageTitle, url: pageUrl, data: jobData, email: email}),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Title saved successfully:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error sending title to Flask backend:", error);
    //   });
    // Fetch the email dynamically
    chrome.identity.getProfileUserInfo((userInfo) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching email:", chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      const email = userInfo.email || "unknown@example.com"; // Fallback if email is unavailable
      console.log("Fetched email for addToNewFile:", email);

      // Proceed with sending data to Flask
      const pageTitle = request.title;
      const pageUrl = request.url;
      const jobData = request.data;

      fetch("http://127.0.0.1:5000/save-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: pageTitle, url: pageUrl, data: jobData, email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Title saved successfully:", data);
          sendResponse({ success: true, data: data });
        })
        .catch((error) => {
          console.error("Error sending title to Flask backend:", error);
          sendResponse({ success: false, error: error.message });
        });
    });

    // Return true to indicate the response will be sent asynchronously
    return true;

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
  } else if (request.action === "sendToMl") {
    const page_content = request.pageContent;

    fetch("http://127.0.0.1:5000/analyze-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageContent: page_content }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Title saved successfully:", data);
        const companyName = data.most_common.ORG;
        const location = data.most_common.GPE;
        const jobTitle = data.most_common.job_title;

        // Send the extracted data to content.js (the webpage)
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "updateModal",
              companyName: companyName,
              location: location,
              jobTitle: jobTitle,
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error sending title to Flask backend:", error);
      });


  //     const page_content = request.pageContent;

  // // Fetch the user's email
  // chrome.identity.getProfileUserInfo((userInfo) => {
  //   if (chrome.runtime.lastError) {
  //     console.error("Error fetching email:", chrome.runtime.lastError.message);
  //     return;
  //   }

  //   const email = userInfo.email || "unknown@example.com"; // Default to a fallback email if unavailable
  //   console.log("Fetched email for sendToMl:", email);

  //   // Include email in the payload
  //   fetch("http://127.0.0.1:5000/analyze-text", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ pageContent: page_content, email: email }), // Add email here
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Title saved successfully:", data);

  //       // Extract company details from response
  //       const companyName = data.most_common.ORG;
  //       const location = data.most_common.GPE;
  //       const jobTitle = data.most_common.job_title;

  //       // Send the extracted data to the active tab (content.js)
  //       chrome.tabs.query(
  //         { active: true, currentWindow: true },
  //         function (tabs) {
  //           if (tabs.length > 0) {
  //             chrome.tabs.sendMessage(tabs[0].id, {
  //               action: "updateModal",
  //               companyName: companyName,
  //               location: location,
  //               jobTitle: jobTitle,
  //             });
  //           } else {
  //             console.error("No active tab found to send the message.");
  //           }
  //         }
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Error sending title to Flask backend:", error);
  //     });
  // });
  }

});

