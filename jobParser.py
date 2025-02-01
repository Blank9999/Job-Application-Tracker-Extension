
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from collections import Counter
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("API_URL")
key = os.getenv("API_SERVICE_ROLE")
api_key = os.getenv("GROQ_API")
client = Groq(
    api_key=api_key,
)
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

@app.route('/save-title',methods=['POST']) # server is only accepting POST method
def save_title():
    data = request.get_json()  

    if not data:
        return jsonify({"status": "error", "message": "No JSON data sent"}), 400
    
    page_title = data.get('title')
    page_url = data.get('url')
    job_data = data.get('data')
    email = data.get('email')

    if not page_title:
        return jsonify({"status": "error", "message": "No title provided"}), 400

    entities = {"ORG": job_data['org_name'], "GPE": job_data['location'], "TITLE": job_data['job_title'],"URL": page_url}
    isNew = job_data['isNew']
    # print(email)

    if isNew:
        fileName = job_data['file_name']
        file_id = create_new_file(fileName,email)
        add_file_jobs(entities, file_id)
    else:
        file_id = job_data['file_id']
        add_file_jobs(entities, file_id)

    return jsonify({"status": "success", "message": "Title saved successfully!"})

@app.route('/analyze-text',methods=['POST'])
def analyze_text():
    data = request.get_json()  
    if not data:
        return jsonify({"status": "error", "message": "No JSON data sent"}), 400
    
    page_content = data.get('pageContent')

    if not page_content:
        return jsonify({"status": "error", "message": "No title provided"}), 400
    
    query = "\nThis is a job application. Pick out the location of the company, the name of the company and the position of the job. give the output in 3 different lines in the form location: location of the company, company: name of the company and position: position of the company "

    page_content += f"\n{query}"

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": page_content
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    response = chat_completion.choices[0].message.content
    entries = {}

    for line in response.strip().split('\n'):
        lowerCaseLine = line.lower()
        print(lowerCaseLine)
        if  "location" in lowerCaseLine:
            # print("reached here ")
            entries["gpe"] = line.split(":")[1].strip()
        elif "company" in lowerCaseLine:
            entries["org"] = lowerCaseLine.split(":")[1].strip()
        elif "position" in lowerCaseLine:
            entries["title"] = line.split(":")[1].strip()
    
    print(entries)
    response_data = {
        "status": "success",
        "message": "Title processed successfully!",
        "most_common": {
            "ORG": entries["org"],
            "GPE": entries["gpe"],
            "job_title": entries["title"]
        }
    }

    print(f"The response data is  {response_data}")
    return jsonify(response_data)


def add_file_jobs(entities, file_id):
    job_id = create_job_info_row(entities)
    mapping_response = supabase.table('file_to_jobs').insert({
        "file_id": file_id,
        "job_id": job_id
    }).execute()

    print("Successfully added to the file_to_jobs")

def create_new_file(file,email):
    response = supabase.table('file_name').insert({
        "file_name": file,
        "mail": email
    }).execute()

    if response and response.data:
        job_id = response.data[0]['id']  # Extract the ID of the inserted job
        print(f"New file created successfully! Response: {job_id}")
        return job_id
    else:
        print(f"Failed to insert file . Response: {response}")
        return None


def create_job_info_row(data):

    print("the data is ",data)
    response = supabase.table('job_info').insert({
        "organization": data['ORG'],
        "job_title": data['TITLE'],
        "location": data['GPE'],
        "url": data['URL']
    }).execute()

    if response and response.data:
        job_id = response.data[0]['id'] 
        print(f"Job info inserted successfully! Job ID: {job_id}")
        return job_id
    else:
        print(f"Failed to insert job info. Response: {response}")
        return None


@app.route('/fetch-title', methods=['GET'])
def fetch_create_job_info_row():
    file_id = request.args.get('file_id')
    if file_id is None:
        return "File ID is required", 400 
    response = supabase.from_('file_to_jobs').select('id, job_info(id,organization,job_title,location,url),file_name(id,file_name)').eq('file_id', file_id).execute()
    data = response.data
    return render_template('job_table.html', jobs=data)


@app.route('/file-name', methods=['GET'])
def fetch_file_name():
    email = request.args.get('email')
    response = supabase.table("file_name").select("*").eq('mail',email).execute()
    data = response.data
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)