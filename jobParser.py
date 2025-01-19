from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from collections import Counter

nlp = spacy.load("en_core_web_trf")

app = Flask(__name__)
CORS(app)

@app.route('/process-content', methods=['POST'])  # Server is only accepting POST method
def save_title():
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "No JSON data sent"}), 400

    page_content = data.get('content')

    if not page_content:
        return jsonify({"status": "error", "message": "No content provided"}), 400

    print(f"Received page title: {page_content}")

    doc = nlp(page_content)

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

    return jsonify(response_data)


if __name__ == "__main__":
    app.run(debug=True)
