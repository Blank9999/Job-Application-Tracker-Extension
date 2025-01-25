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
  } else if (request.action === "getUserInfo") {
    // console.log("It reache here");
    // chrome.identity.getProfileUserInfo((userInfo) => {
    //   console.log("The user info is ", userInfo);
    //   if (userInfo.id) {
    //     console.log("User ID:", userInfo.id);
    //     console.log("Email:", userInfo.email);
    //     sendResponse({
    //       success: true,
    //       userId: userInfo.id,
    //       email: userInfo.email,
    //     });
    //   } else {
    //     console.error("Failed to get user information.");
    //     sendResponse({
    //       success: false,
    //       error: "Failed to retrieve user info.",
    //     });
    //   }
    // });
    // return true;

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      // if (chrome.runtime.lastError) {
      //   console.log("Error getting auth token:", chrome.runtime.lastError);
      //   sendResponse({ success: false, error: chrome.runtime.lastError });
      //   return;
      // }

      // Fetch user info from Google using the OAuth token
      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User info:", data);
          const userId = data.id;
          const email = data.email;
          console.log("User ID:", userId);
          console.log("Email:", email);

          // Send the user info to the content script
          sendResponse({
            success: true,
            userId: userId,
            email: email,
          });
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          sendResponse({ success: false, error: error.message });
        });
    });

    return true;
  }
});
