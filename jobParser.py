
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import spacy
from supabase import create_client, Client
from dotenv import load_dotenv
from collections import Counter

nlp = spacy.load("en_core_web_trf")
load_dotenv()
url = os.getenv("API_URL")
key = os.getenv("API_SERVICE_ROLE")
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

    if not page_title:
        return jsonify({"status": "error", "message": "No title provided"}), 400

    entities = {"ORG": job_data['org_name'], "GPE": job_data['location'], "TITLE": job_data['job_title'],"URL": page_url}
    isNew = job_data['isNew']

    if isNew:
        fileName = job_data['file_name']
        file_id = create_new_file(fileName)
        add_file_jobs(entities, file_id)
    else:
        file_id = job_data['file_id']
        add_file_jobs(entities, file_id)

    # doc = nlp(page_title)

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
    return jsonify({"status": "success", "message": "Title saved successfully!"})

@app.route('/analyze-text',methods=['POST'])
def analyze_text():
    data = request.get_json()  
    if not data:
        return jsonify({"status": "error", "message": "No JSON data sent"}), 400
    
    page_content = data.get('pageContent')

    if not page_content:
        return jsonify({"status": "error", "message": "No title provided"}), 400
    
    print(f"Received page title:{page_content}")

    doc = nlp(page_content)
    # entities = {"ORG": [], "GPE": [], "TITLE": []}
    
    # print([(w.text, w.pos_) for w in doc])

    # for ent in doc.ents:
    #     if ent.label_ == "ORG":
    #         entities["ORG"].append(ent.text)  # Company name
    #     elif ent.label_ == "GPE":
    #         entities["GPE"].append(ent.text)  # Location
    #     elif ent.label_ == "PERSON":  # Job title approximation (customize if needed)
    #         entities["TITLE"].append(ent.text)

    # # Attempt pattern matching for job title
    # job_title = None
    # for token in doc:
    #     if token.pos_ == "NOUN" and "job" in token.text.lower():
    #         job_title = token.text
    #         break

    # extracted_data = {
    #     "company_name": entities["ORG"][0] if entities["ORG"] else None,
    #     "location": entities["GPE"][0] if entities["GPE"] else None,
    #     "job_title": job_title or (entities["TITLE"][0] if entities["TITLE"] else None)
    # }

    # print(f"Extracted data: {extracted_data}")
    # Initialize label counts
    label_counts = {"ORG": Counter(), "GPE": Counter()}
    job_title_counter = Counter()

    # Process entities
    for ent in doc.ents:
        if ent.label_ in label_counts:
            label_counts[ent.label_][ent.text] += 1  # Increment count for the entity text

    # Attempt pattern matching for job title
    for token in doc:
        if token.pos_ == "NOUN" and "job" in token.text.lower():
            job_title_counter[token.text] += 1

    # Find the most common entities and job title
    most_common_words = {
        label: counts.most_common(1)[0] if counts else None
        for label, counts in label_counts.items()
    }
    most_common_job_title = job_title_counter.most_common(1)[0] if job_title_counter else None

    # Output results
    print("Entity Counts by Label:")
    for label, counts in label_counts.items():
        print(f"{label}: {dict(counts)}")

    print("\nMost Common Words by Label:")
    for label, word_data in most_common_words.items():
        if word_data:
            print(f"{label}: '{word_data[0]}' with {word_data[1]} appearances")
        else:
            print(f"{label}: None")

    print("\nMost Common Job Title:")
    if most_common_job_title:
        print(f"Job Title: '{most_common_job_title[0]}' with {most_common_job_title[1]} appearances")
    else:
        print("Job Title: None")

    # Construct response
    response_data = {
        "status": "success",
        "message": "Title processed successfully!",
        "most_common": {
            "ORG": most_common_words["ORG"],
            "GPE": most_common_words["GPE"],
            "job_title": most_common_job_title
        }
    }

    print(f"The response data is  {response_data}")

    # return jsonify({"status": "success", "message": "Title saved successfully!"}) 
    return jsonify(response_data)


def add_file_jobs(entities, file_id):
    job_id = create_job_info_row(entities)
    mapping_response = supabase.table('file_to_jobs').insert({
        "file_id": file_id,
        "job_id": job_id
    }).execute()

    print("Successfully added to the file_to_jobs")

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
        job_id = response.data[0]['id'] 
        print(f"Job info inserted successfully! Job ID: {job_id}")
        return job_id
    else:
        print(f"Failed to insert job info. Response: {response}")
        return None


@app.route('/fetch-title', methods=['GET'])
def fetch_create_job_info_row():
    file_id = request.args.get('file_id')
    print(f"The file id is : {file_id}")
    if file_id is None:
        return "File ID is required", 400 
    response = supabase.from_('file_to_jobs').select('id, job_info(id,organization,job_title,location,url),file_name(id,file_name)').eq('file_id', file_id).execute()
    data = response.data
    return render_template('job_table.html', jobs=data)


@app.route('/file-name', methods=['GET'])
def fetch_file_name():
    response = supabase.table("file_name").select("*").execute()
    data = response.data
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)

