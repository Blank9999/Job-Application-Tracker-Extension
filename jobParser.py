
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
# import spacy
# nlp = spacy.load("en_core_web_trf")
from supabase import create_client, Client
from dotenv import load_dotenv


load_dotenv()
# url = "https://nwgttfuuheacpjjqhtsg.supabase.co"
# key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z3R0ZnV1aGVhY3BqanFodHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjE0MTgwMCwiZXhwIjoyMDUxNzE3ODAwfQ.OEvdFS7iG_6i5HD0DzE0HojLP07-pZUY0Z_6UuunyOs"
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

    # print(f"Job data: {job_data}")
    # print("The page url is ",page_url)
    if not page_title:
        return jsonify({"status": "error", "message": "No title provided"}), 400
    
    # print(f"Received page title:{page_title}")

    # doc = nlp(page_title)

    entities = {"ORG": job_data['org_name'], "GPE": job_data['location'], "TITLE": job_data['job_title'],"URL": page_url}
    fileName = job_data['file_name']
    
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
    create_job_info_row(entities)
    create_new_file(fileName)
    return jsonify({"status": "success", "message": "Title saved successfully!"})


def create_new_file(file):
    print("The new file to be created is ",file)

    response = supabase.table('file_name').insert({
        "file_name": file
    }).execute()

    print("New file created successfully!")


def create_job_info_row(data):

    print("the data is ",data)
    response = supabase.table('job_info').insert({
        "organization": data['ORG'],
        "job_title": data['TITLE'],
        "location": data['GPE'],
        "url": data['URL']
    }).execute()

    print("Job info inserted successfully!")

    # if response.get('error'):
    #     print(f"Error: {response['error']}")
    # else:
    #     print("Job info inserted successfully!")
    # if response.error is None:
    # else:
    #     print(f"Error inserting job info: {response.error}")

@app.route('/fetch-title', methods=['GET'])
def fetch_create_job_info_row():
    response = supabase.table("job_info").select("*").execute()
    data = response.data
    # return jsonify(response.data), 200
    return render_template('job_table.html', jobs=data)



if __name__ == "__main__":
    app.run(debug=True)

