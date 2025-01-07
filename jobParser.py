
from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
nlp = spacy.load("en_core_web_trf")

app = Flask(__name__)
CORS(app)
# CORS(app)


@app.route('/save-title',methods=['POST']) # server is only accepting POST method
def save_title():
    data = request.get_json()  

    if not data:
        return jsonify({"status": "error", "message": "No JSON data sent"}), 400
    
    page_title = data.get('title')

    if not page_title:
        return jsonify({"status": "error", "message": "No title provided"}), 400
    
    print(f"Received page title:{page_title}")

    doc = nlp(page_title)

    entities = {"ORG": [], "GPE": [], "TITLE": []}
    
    print([(w.text, w.pos_) for w in doc])

    for ent in doc.ents:
        if ent.label_ == "ORG":
            entities["ORG"].append(ent.text)  # Company name
        elif ent.label_ == "GPE":
            entities["GPE"].append(ent.text)  # Location
        elif ent.label_ == "PERSON":  # Job title approximation (customize if needed)
            entities["TITLE"].append(ent.text)

    # Attempt pattern matching for job title
    job_title = None
    for token in doc:
        if token.pos_ == "NOUN" and "job" in token.text.lower():
            job_title = token.text
            break

    # Combine results
    extracted_data = {
        "company_name": entities["ORG"][0] if entities["ORG"] else None,
        "location": entities["GPE"][0] if entities["GPE"] else None,
        "job_title": job_title or (entities["TITLE"][0] if entities["TITLE"] else None)
    }

    print(f"Extracted data: {extracted_data}")
    return jsonify({"status": "success", "message": "Title saved successfully!"})



if __name__ == "__main__":
    app.run(debug=True)

