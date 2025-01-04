// const pageTitle = document.title;
// const pageContent = document.body.innerText;

// console.log("Page Title:", pageTitle);
// console.log("Page Content:", pageContent);

// // Sending data to background script or extension
// chrome.runtime.sendMessage({
//   type: "PAGE_CONTENT",
//   title: pageTitle,
//   content: pageContent,
// });

// content-script.js
(function () {
    const patterns = [
       /apply/i,                     // Words like "Apply"
      /job/i,                       // Words like "Job"
       /careers/i,                   // Words like "Careers"
       /linkedin\.com\/jobs/i,       // LinkedIn Jobs URL
       /glassdoor\.com/i,            // Glassdoor
       /greenhouse\.io/i,            // Greenhouse.io
    ];
    // pattern.test(document.body.innerHTML) ||
    const isJobSite = patterns.some(pattern => pattern.test(window.location.href));
    console.log(isJobSite);
    if (isJobSite) {
      console.log("This page is a job application site!");
      chrome.runtime.sendMessage({ isJobSite: true });
    } else {
      chrome.runtime.sendMessage({ isJobSite: false });
    }
  })();