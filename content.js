(function () {
  // Patterns to match job-related URLs
  const patterns = [
    /apply/i,                     // Words like "Apply"
    /job/i,                       // Words like "Job"
    /careers/i,                   // Words like "Careers"
    /linkedin\.com\/jobs/i,       // LinkedIn Jobs URL
    /glassdoor\.com/i,            // Glassdoor
    /greenhouse\.io/i,            // Greenhouse.io
  ];

  function isGoogleURL() {
    const googlePattern = /google\.com/i;
    return googlePattern.test(window.location.href);
  }
  // Function to fetch keywords from dictionary.txt
  async function fetchKeywords() {
    const response = await fetch(chrome.runtime.getURL("dictionary.txt"));
    const text = await response.text();
    return text.split("\n").map(keyword => keyword.trim()).filter(keyword => keyword);
  }

  // Function to check if the page contains job-related keywords
  async function analyzePageContent() {
    const jobKeywords = await fetchKeywords();
    const bodyText = document.body.innerText.toLowerCase();
    
    // Check for keywords in the page content
    const foundKeywords = jobKeywords.filter(keyword => bodyText.includes(keyword));
    return foundKeywords.length > 5; // Adjust threshold as needed
  }

  // Check for URL patternss
  const isJobSiteURL = patterns.some(pattern => pattern.test(window.location.href)) && !isGoogleURL(window.location.href);

  // Analyze page content for keywords
  analyzePageContent().then(isJobSiteContent => {
    const isJobSite = isJobSiteURL && isJobSiteContent;
    console.log(isJobSiteURL);
    console.log(isJobSiteContent);
    // Log the result
    if (isJobSite) {
      console.log("This page is a job application site!");
      chrome.runtime.sendMessage({ isJobSite: true });
    } else {
      console.log("This page is not a job application site.");
      chrome.runtime.sendMessage({ isJobSite: false });
    }
  }).catch(error => {
    console.error("Error analyzing page content:", error);
  });
})();