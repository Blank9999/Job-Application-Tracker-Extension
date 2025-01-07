from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app)

@app.route('/')
def hello_world():
    return "<p>Hello, World!</p>"

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


if __name__ == "__main__":
    app.run(debug=True)