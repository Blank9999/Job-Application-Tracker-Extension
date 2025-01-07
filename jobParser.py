
from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import en_core_web_sm
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
CORS(app)
# CORS(app)


@app.route('/save-title',methods=['POST'])
def save_title():
    data = request.get_json()  

    if not data:
        return jsonify({"status": "error", "message": "No JSON data sent"}), 400
    
    page_title = data.get('title')

    if not page_title:
        return jsonify({"status": "error", "message": "No title provided"}), 400
    
    print(f"Received page title:{page_title}")

    return jsonify({"status": "success", "message": "Title saved successfully!"})

nlp = en_core_web_sm.load()

doc = nlp("This is a sentence.")
print([(w.text, w.pos_) for w in doc])


if __name__ == "__main__":
    app.run(debug=True)

