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

    popup.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Job Application Detected!</div>
      <p style="margin: 0;">We detected that this page is related to a job application. Do you want us to add this </p>
      <button id="popupButton" style="margin-top: 10px; padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Create New File</button>
      <button id="popupButton" style="margin-top: 10px; padding: 10px; background-color: #0078d4; color: white; border: none; border-radius: 5px; cursor: pointer;">Open Existing File</button>
    `;

    document.body.appendChild(popup);

    // Add click event for the button
    document.getElementById("popupButton").addEventListener("click", () => {
      alert("Popup action triggered!");
    });
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

    // console.log("This is the content lowerCaseContent ", lowerCaseContent);
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

  let title = document.title; // Get the <title> content

  // Log the extracted job position and the location

  console.log(title);

  const currentURL = window.location.href;
  
  console.log(currentURL);   

})();