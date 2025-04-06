# Jobify

Jobify is a Chrome extension designed to streamline your job application tracking process. It detects job application pages, auto-saves relevant job information, and utilizes powerful AI to extract key job details—all while keeping your data neatly organized. Ideal for job seekers looking to simplify and automate their job search workflow.

## 🌟💡 Problem Statement

Jobify solves the problem of manually tracking job applications and entering job details into spreadsheets.It eliminates the tedious process of copying and pasting information from job listings into a Google Sheet by automatically detecting job application pages, saving relevant job details, and organizing them for easy access.

## 📸 Demo

![IMG_4944](https://github.com/user-attachments/assets/337e47d1-e948-4fc3-8eb5-629135c785df)

![IMG_4945](https://github.com/user-attachments/assets/b8888135-0d4f-4214-abd6-a90d6e4659ce)

![IMG_4949](https://github.com/user-attachments/assets/68dad1c6-9922-4dcf-8c64-bc8b90554b07)

![IMG_4947](https://github.com/user-attachments/assets/bd413bdc-0b84-4b90-8169-f4643a307e63)


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
git clone https://github.com/Blank9999/Jobify.git
cd Job-Application-Tracker-Extension
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

### 4. Install backend dependencies
```bash
pip install -r requirements.txt
```

### 5. Load the Chrome Extension

- Open Chrome and go to chrome://extensions/
- Enable Developer mode (top right)
- Click Load unpacked
- Select the Job-Application-Tracker-Extension directory

### 6. Run the Flask backend
```bash
python jobParser.py
```

## ✨ Future Improvements

- 🔄 Real-time job updates and sync.
- 📈 Analytics dashboard for applied jobs.
- 🗂️ Job categorization with tags and filters.
- 💾 **Supabase Integration**: Saves parsed job data to Supabase for persistent storage.
- 📅 Calendar integration to track follow-ups and deadlines.

## 🙏 Acknowledgments

- Thanks to Groq for their lightning-fast LPU APIs.
- Inspired by the need to simplify job applications and reduce repetitive tracking efforts.
- Big shoutout to the open-source tools and the job-seeking community for inspiration.
