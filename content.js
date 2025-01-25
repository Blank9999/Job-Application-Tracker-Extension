let lastContent = "";
let timeout;
let isJobSiteContent = false;

(function () {
  // Patterns to match job-related URLs

  function createPopup() {
    const popup = document.createElement("div");
    popup.id = "jobPopup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.width = "300px";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "#f9f9f9";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    popup.style.borderRadius = "10px";
    popup.style.display = "none"; // Initially hidden
    popup.style.zIndex = "9999";

    const closeButton = document.createElement("div");
    closeButton.innerHTML = "&#10006;"; // Unicode for "X"
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "#333"; // Optional: Change color of X
    closeButton.style.fontWeight = "bold";
    popup.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    const content = document.createElement("div");
    content.innerHTML = `
    <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Job Application Detected!</div>
    <p style="margin: 0;">We detected that this page is related to a job application. Do you want us to add this?</p>
    <button id="createNewFileBtn" style="margin-top: 10px; padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Add to a New File</button>
    <button id="openFileBtn" style="margin-top: 10px; padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Add to an Existing File</button>
    <button id="openExistingFile" style="margin-top: 10px; padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Open your Files</button>
  `;

    popup.appendChild(content);
    document.body.appendChild(popup);

    document
        .getElementById("createNewFileBtn")
        .addEventListener("click", createJobForm);

    document
        .getElementById("openFileBtn")
        .addEventListener("click", openJobForm);

    document
        .getElementById("openExistingFile")
        .addEventListener("click", async () => {
            const response = await fetch("http://127.0.0.1:5000/file-name");
            const fileNames = await response.json();

            popup.innerHTML = `
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Job Application</div>
          <p style="margin: 0;">These are your files. Select one to view all your applications:</p>
          <select id="exitingFileName" style="width: 100%; padding: 10px; margin-bottom: 10px;">
            ${fileNames
                .map(
                    (file) =>
                        `<option value="${file.id}">${file.file_name}</option>`
                )
                .join("")}
          </select>
          <button id="openUserFiles" style="margin-top: 10px; padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Open</button>
          <button id="goBack" style="margin-top: 10px; padding: 10px; background-color: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">Go Back</button>
        `;

            document
                .getElementById("openUserFiles")
                .addEventListener("click", openUserFiles);

            document
                .getElementById("goBack")
                .addEventListener("click", () => {
                    popup.remove(); // Remove the current popup
                    createPopup(); // Recreate the original popup
                    document.getElementById("jobPopup").style.display = "block"; // Show the recreated popup
                });
        });

    // Display the popup
    popup.style.display = "block";
}


  async function createJobForm() {
    await sendToMlModel();
    const result = await receiveFromModel();

    const modal = document.createElement("div");
    modal.id = "jobFormModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "400px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#ffffff";
    modal.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    modal.style.borderRadius = "10px";
    modal.style.zIndex = "10000";

    modal.innerHTML = `
      <label for="documentNameInput" style="display: block; margin-bottom: 5px;">Enter File Name </label>
      <input id="documentNameInput" type="text" style="width: 100%; padding: 8px; margin-bottom: 10px;" />
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Enter Job Details</div>
      <label for="jobTitle" style="display: block; margin-bottom: 5px;">Job Title:</label>
      <input id="jobTitle" type="text" style="width: 100%; padding: 8px; margin-bottom: 10px;" />
      
      <label for="orgName" style="display: block; margin-bottom: 5px;">Organization Name:</label>
      <input id="orgName" type="text" style="width: 100%; padding: 8px; margin-bottom: 10px;" />
      
      <label for="jobLocation" style="display: block; margin-bottom: 5px;">Location:</label>
      <input id="jobLocation" type="text" style="width: 100%; padding: 8px; margin-bottom: 20px;" />
      
      <button id="saveJobDetails" style="padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Save</button>
      <button id="cancelJobDetails" style="padding: 10px; background-color: #ccc; color: black; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Cancel</button>
    `;

    document.body.appendChild(modal);

    document
      .getElementById("saveJobDetails")
      .addEventListener("click", saveJobDetails);

    document
      .getElementById("cancelJobDetails")
      .addEventListener("click", () => {
        modal.style.display = "none";
      });

    document.getElementById("jobTitle").value = result.jobTitle;
    document.getElementById("orgName").value = result.companyName;
    document.getElementById("jobLocation").value = result.location;
  }

  async function openJobForm() {
    await sendToMlModel();
    const response = await fetch("http://127.0.0.1:5000/file-name");
    const fileNames = await response.json();
    const result = await receiveFromModel();

    console.log("The result is ", result);
    // const mlResponse = await fetch("http://127.0.0.1:5000/analyze-text");
    // const mlData = await mlResponse.json();

    // console.log("The ml data is ", mlData);

    const fileModal = document.createElement("div");
    fileModal.id = "jobFormModal";
    fileModal.style.position = "fixed";
    fileModal.style.top = "50%";
    fileModal.style.left = "50%";
    fileModal.style.transform = "translate(-50%, -50%)";
    fileModal.style.width = "400px";
    fileModal.style.padding = "20px";
    fileModal.style.backgroundColor = "#ffffff";
    fileModal.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    fileModal.style.borderRadius = "10px";
    fileModal.style.zIndex = "10000";

    if (response.ok) {
      fileModal.innerHTML = `
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Select a File</div>
        <select id="fileNameOptions" style="width: 100%; padding: 10px; margin-bottom: 10px;">
          ${fileNames
            .map(
              (file) => `<option value="${file.id}">${file.file_name}</option>`
            )
            .join("")}
        </select>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Enter Job Details</div>
        <label for="fileModalJobTitle" style="display: block; margin-bottom: 5px;">Job Title:</label>
        <input id="fileModalJobTitle" type="text" style="width: 100%; padding: 8px; margin-bottom: 10px;" />
        
        <label for="fileModalOrgName" style="display: block; margin-bottom: 5px;">Organization Name:</label>
        <input id="fileModalOrgName" type="text" style="width: 100%; padding: 8px; margin-bottom: 10px;" />
        
        <label for="fileModalJobLocation" style="display: block; margin-bottom: 5px;">Location:</label>
        <input id="fileModalJobLocation" type="text" style="width: 100%; padding: 8px; margin-bottom: 20px;" />
        
        <button id="fileModalSaveJobDetails" style="padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Save</button>
        <button id="fileModalCancelJobDetails" style="padding: 10px; background-color: #ccc; color: black; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Cancel</button>
      `;
    }

    document.body.appendChild(fileModal);

    document
      .getElementById("fileModalCancelJobDetails")
      .addEventListener("click", () => {
        modal.style.display = "none";
      });

    document
      .getElementById("fileModalSaveJobDetails")
      .addEventListener("click", addExistingFile);

    document.getElementById("fileModalJobTitle").value = result.jobTitle;
    document.getElementById("fileModalOrgName").value = result.companyName;
    document.getElementById("fileModalJobLocation").value = result.location;
  }

  function showPopup() {
    const popup = document.getElementById("jobPopup");
    if (popup) {
      popup.style.display = "block";
    }
  }

  const patterns = [
    /apply/i, // Words like "Apply"
    /job/i, // Words like "Job"
    /careers/i, // Words like "Careers"
    /linkedin\.com\/jobs/i, // LinkedIn Jobs URL
    /glassdoor\.com/i, // Glassdoor
    /greenhouse\.io/i, // Greenhouse.io
  ];

  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const currentContent = document.body.innerText;

      if (currentContent !== lastContent) {
        lastContent = currentContent; // Update lastContent

        try {
          isJobSiteContent = await analyzePageContent(currentContent);

          if (isJobSiteContent) {
            observer.disconnect();
            if (isJobSiteURL) {
              console.log("This page is a job application site!");
              showPopup();
            } else {
              console.log("This page is not a job application site!");
            }
          }
          console.log("Job-related content detected:", isJobSiteContent);
        } catch (error) {
          console.error("Error analyzing current content:", error);
        }
      }
    }, 300); // Wait 300ms before checking
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function openUserFiles() {
    const fileId = document.getElementById("exitingFileName").value;

    chrome.runtime.sendMessage({
      action: "OpenUserFiles",
      file_id: fileId,
    });

    // console.log("Hello Wrold");

    const newTabUrl = `http://127.0.0.1:5000/fetch-title?file_id=${fileId}`;
    console.log(newTabUrl);
    window.open(newTabUrl, "_blank");
  }

  function addExistingFile() {
    const jobTitle = document.getElementById("fileModalJobTitle").value;
    const orgName = document.getElementById("fileModalOrgName").value;
    const location = document.getElementById("fileModalJobLocation").value;
    const fileId = document.getElementById("fileNameOptions").value;

    const job_data = {
      job_title: jobTitle,
      org_name: orgName,
      location: location,
      file_id: fileId,
      isNew: false,
    };

    createJobTrackerFile(job_data);
  }

  function saveJobDetails() {
    const jobTitle = document.getElementById("jobTitle").value;
    const orgName = document.getElementById("orgName").value;
    const location = document.getElementById("jobLocation").value;
    const fileName = document.getElementById("documentNameInput").value;
    // const fileName =

    const job_data = {
      job_title: jobTitle,
      org_name: orgName,
      location: location,
      file_name: fileName,
      isNew: true,
    };

    createJobTrackerFile(job_data);
  }

  function createJobTrackerFile(job_data) {
    // const pageTitle = document.title;
    console.log("Hello");
    const pageContent = document.body.innerText;
    const pageUrl = window.location.href;
    // console.log("The content is ", pageContent);
    chrome.runtime.sendMessage({
      action: "addToNewFile",
      title: pageContent,
      url: pageUrl,
      data: job_data,
    });
  }

  async function sendToMlModel() {
    const page_content = document.body.innerText;
    chrome.runtime.sendMessage({
      action: "sendToMl",
      pageContent: page_content,
    });
  }

  async function receiveFromModel() {
    return new Promise((resolve, reject) => {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "updateModal") {
          const companyName = message.companyName;
          const location = message.location;
          let jobTitle = message.jobTitle;

          // Handle jobTitle condition
          if (jobTitle.toLowerCase() === "job") {
            jobTitle = "";
          }

          // Log the extracted data (for debugging)
          console.log("Company Name:", companyName);
          console.log("Location:", location);
          console.log("Job Title:", jobTitle);

          // Send the response and resolve the promise with the data
          sendResponse({ location, companyName, jobTitle });

          // Resolve the promise with the same data
          resolve({ location, companyName, jobTitle });
        }
      });
    });
  }

  // async function reiceveFromModel() {
  //   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //     if (message.action === "updateModal") {
  //       const companyName = message.companyName[0];
  //       const location = message.location[0];
  //       let jobTitle = message.jobTitle[0];

  //       if (jobTitle.toLowerCase() === "job") {
  //         jobTitle = "";
  //       }

  //       // Log the data (for debugging)
  //       console.log("Company Name:", companyName);
  //       console.log("Location:", location);
  //       console.log("Job Title:", jobTitle);

  //       // Update the modal with the extracted data
  //       document.getElementById("fileModalOrgName").value = companyName || "";
  //       document.getElementById("fileModalJobLocation").value = location || "";
  //       document.getElementById("fileModalJobTitle").value = jobTitle || "";
  //     }
  //   });
  // }

  function isGoogleURL() {
    const googlePattern = /google\.com/i;
    return googlePattern.test(window.location.href);
  }
  // Function to fetch keywords from dictionary.txt
  async function fetchKeywords() {
    const response = await fetch(chrome.runtime.getURL("dictionary.txt"));
    const text = await response.text();
    return text
      .split("\n")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword);
  }

  // Function to check if the current content contains job-related keywords
  async function analyzePageContent(currentContent) {
    const jobKeywords = await fetchKeywords();
    const lowerCaseContent = currentContent.toLowerCase();

    // Array to store all matching keywords, including duplicates
    const foundKeywords = [];

    // Check for each keyword's occurrences in the current content
    jobKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword, "gi"); // Match substring, case-insensitive
      const matches = lowerCaseContent.match(regex); // Find all occurrences of the keyword
      if (matches) {
        foundKeywords.push(...matches); // Add all matches to the foundKeywords array
      }
    });

    return foundKeywords.length > 15; // Adjust threshold as needed
  }

  // Check for URL patterns
  const isJobSiteURL =
    patterns.some((pattern) => pattern.test(window.location.href)) &&
    !isGoogleURL(window.location.href);

  createPopup();
})();