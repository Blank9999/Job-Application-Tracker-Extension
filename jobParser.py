from flask import Flask
import spacy
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)

@app.route('/')

# Using spacy.load().
def hello_world():
    return "<p>Hello, World!</p>"

import en_core_web_sm

nlp = en_core_web_sm.load()

doc = nlp("This is a sentence.")
print([(w.text, w.pos_) for w in doc])

# Importing as module.
import en_core_web_sm
nlp = en_core_web_sm.load()

if __name__ == "__main__":
    app.run(debug=True)

















