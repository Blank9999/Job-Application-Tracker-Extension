
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
# import spacy
# nlp = spacy.load("en_core_web_trf")
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("API_URL")
key = os.getenv("API_SERVICE_ROLE")
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)
# CORS(app)


@app.route('/save-title',methods=['POST']) # server is only accepting POST method
def save_title():
    data = request.get_json()  

    if not data:
        return jsonify({"status": "error", "message": "No JSON data sent"}), 400
    
    page_title = data.get('title')
    page_url = data.get('url')
    job_data = data.get('data')

    if not page_title:
        return jsonify({"status": "error", "message": "No title provided"}), 400
    # doc = nlp(page_title)

    entities = {"ORG": job_data['org_name'], "GPE": job_data['location'], "TITLE": job_data['job_title'],"URL": page_url}
    # fileName = job_data['file_name']
    file_id = job_data['file_id']
    
    # print([(w.text, w.pos_) for w in doc])

    # for ent in doc.ents:
    #     if ent.label_ == "ORG":
    #         entities["ORG"].append(ent.text)  # Company name
    #     elif ent.label_ == "GPE":
    #         entities["GPE"].append(ent.text)  # Location
    #     elif ent.label_ == "PERSON":  # Job title approximation (customize if needed)
    #         entities["TITLE"].append(ent.text)

    # Attempt pattern matching for job title
    # job_title = None
    # for token in doc:
    #     if token.pos_ == "NOUN" and "job" in token.text.lower():
    #         job_title = token.text
    #         break

    # # Combine results
    # extracted_data = {
    #     "company_name": entities["ORG"][0] if entities["ORG"] else None,
    #     "location": entities["GPE"][0] if entities["GPE"] else None,
    #     "job_title": job_title or (entities["TITLE"][0] if entities["TITLE"] else None)
    # }

    print(f"Extracted data: {entities}")
    add_existing_file_jobs(entities,file_id)
    # create_new_file_job(entities,fileName)
    return jsonify({"status": "success", "message": "Title saved successfully!"})


def add_existing_file_jobs(entities, file_id):
    job_id = create_job_info_row(entities)

    print(f"This is the job id {job_id}")
    print(f"This is the file id {file_id}")

    mapping_response = supabase.table('file_to_jobs').insert({
        "file_id": file_id,
        "job_id": job_id
    }).execute()

    print("Successfully added to the file_to_jobs")

def create_new_file_job(entities,file):
    job_id = create_job_info_row(entities)
    file_id = create_new_file(file)
    
    print(f"This is the job id {job_id}")
    print(f"This is the file id {file_id}")

    mapping_response = supabase.table('file_to_jobs').insert({
        "file_id": file_id,
        "job_id": job_id
    }).execute()

    print("Succesfuly added to the file_to_jobs")

def create_new_file(file):
    response = supabase.table('file_name').insert({
        "file_name": file
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
        job_id = response.data[0]['id']  # Extract the ID of the inserted job
        print(f"Job info inserted successfully! Job ID: {job_id}")
        return job_id
    else:
        print(f"Failed to insert job info. Response: {response}")
        return None


@app.route('/fetch-title', methods=['GET'])
def fetch_create_job_info_row():

    response = supabase.from_('file_to_jobs').select('id, job_info(id,organization,job_title,location,url),file_name(id,file_name)').eq('file_id', 6).execute()
    data = response.data
    return render_template('job_table.html', jobs=data)

@app.route('/file-name', methods=['GET'])
def fetch_file_name():
    response = supabase.table("file_name").select("*").execute()
    data = response.data
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)

