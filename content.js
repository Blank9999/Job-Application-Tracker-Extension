let lastContent = "";
let timeout;

(function () {
  // Patterns to match job-related URLs
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

  // Function to check if the page contains job-related keywords
  async function analyzePageContent() {
    const jobKeywords = await fetchKeywords();
    const lowerCaseContent = currentContent.toLowerCase();

    console.log("This is the content lowerCaseContent ", lowerCaseContent);
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

    // console.log("Found Keywords (including substrings):", foundKeywords);
    return foundKeywords.length > 5; // Adjust threshold as needed
  }

  // Check for URL patterns
  const isJobSiteURL =
    patterns.some((pattern) => pattern.test(window.location.href)) &&
    !isGoogleURL(window.location.href);
})();
