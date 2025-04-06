# Job-Application-Tracker-Extension

Jobify is a Chrome extension designed to streamline your job application tracking process. It detects job application pages, auto-saves relevant job information, and utilizes powerful AI to extract key job details—all while keeping your data neatly organized. Ideal for job seekers looking to simplify and automate their job search workflow.

## 🌟💡 Problem Statement

Jobify solves the problem of manually tracking job applications and entering job details into spreadsheets.It eliminates the tedious process of copying and pasting information from job listings into a Google Sheet by automatically detecting job application pages, saving relevant job details, and organizing them for easy access.

## ✨ Features

- 🔍 **Auto Detection**: Automatically detects job application pages.
- 📄 **Smart Extraction**: Uses Meta’s **LLaMA 3.3 70B Versatile** model via the **Groq LPU API** to extract job title, company name, location, job type, and description.
- 🧠 **AI-Powered Parsing**: Leverages LLM to intelligently summarize and parse job details from raw HTML.
- 💾 **Supabase Integration**: Saves parsed job data to Supabase for persistent storage.
- ☁️ **Cloud Hosted Backend**: Flask server hosted on **AWS EC2** for high availability.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Chrome Extension)
- **Backend**: Python (Flask)
- **Database**: Supabase
- **AI Model**: Meta LLaMA 3.3 70B Versatile (via Groq LPU API)
- **Hosting**: AWS EC2

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Blank9999/Job-Application-Tracker-Extension.git
cd Job-Application-Tracker-Extension
