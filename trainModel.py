import spacy
import random
import json
import pandas as pd
import os
from tqdm import tqdm
from spacy.tokens import DocBin

# nlp = spacy.load("en_core_web_trf")

# if "ner" not in nlp.pipe_names:
#     ner = nlp.create_pipe("ner")
#     nlp.add_pipe("ner", last=True)
# else:
#     ner = nlp.get_pipe("ner")

# ner.add_label("job")
# TRAINING_DATA = []

# with open("transformed-job-titles.json","r") as file:
#     for line in file:
#         example = json.loads(line)
#         TRAINING_DATA.append((example["text"], {"entities": example["entities"]}))

# train_data = TRAINING_DATA[:int(0.8 * len(TRAINING_DATA))]
# eval_data = TRAINING_DATA[int(0.8 * len(TRAINING_DATA)):]

# print(train_data)
# print(eval_data)

# optimizer = nlp.begin_training()
# for epoch in range(4):  # Number of training iterations
#     random.shuffle(train_data)
#     losses = {}
    
#     for text, annotations in train_data:
#         # Create Example object
#         doc = nlp.make_doc(text)
#         example = Example.from_dict(doc, annotations)
        
#         # Update the model
#         nlp.update([example], losses=losses)
    
#     print(f"Epoch {epoch} Losses: {losses}")

# nlp.to_disk("job_title_model")

# train_data = []

with open("transformed-job-titles.json","r") as file:
    json_data = json.load(file)

TRAINING_DATA = [(entry['text'], {'entities': entry['entities']}) for entry in json_data['job-titles']]
train_data = TRAINING_DATA[:int(0.8 * len(TRAINING_DATA))]
eval_data = TRAINING_DATA[int(0.8 * len(TRAINING_DATA)):]
