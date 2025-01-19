import json
import spacy
from spacy.tokens import DocBin
from spacy.cli.train import train
from spacy.cli.init_config import init_config
from pathlib import Path

def load_data(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)["job-titles"]
    formatted_data = []
    for entry in data:
        text = entry["text"]
        entities = [(start, end, label) for start, end, label in entry["entities"]]
        formatted_data.append((text, {"entities": entities}))
    return formatted_data

def create_spacy_binary(data, output_path):
    nlp = spacy.load("en_core_web_trf")  # Use the transformer-based pretrained model
    doc_bin = DocBin()
    for text, annotations in data:
        doc = nlp.make_doc(text)
        ents = []
        for start, end, label in annotations["entities"]:
            span = doc.char_span(start, end, label=label, alignment_mode="contract")
            if span is None:
                print(f"Skipping entity [{start}:{end}] in text: {text}")
                continue
            ents.append(span)
        doc.ents = ents
        doc_bin.add(doc)
    doc_bin.to_disk(output_path)
    print(f"Saved binary data to {output_path}")

def train_spacy_model(train_data_path, dev_data_path, output_dir, gpu_id=0):
    if spacy.require_gpu():
        print(f"Using GPU {gpu_id} for training!")
    else:
        raise RuntimeError("GPU not available or properly configured.")
    # Train the model using the manually created config
    train(
        config_path="config.cfg",  # Use the manually created config file
        output_path=output_dir,
        overrides={
            "paths.train": train_data_path,  # Path to training data
            "paths.dev": dev_data_path,  # Path to dev data
            "system.gpu_id": gpu_id  # Specify the GPU ID
        }
    )
    print(f"Model training complete. Saved to {output_dir}")

if __name__ == "__main__":
    # Step 1: Load and split data
    input_file = "1.json"  # Path to your JSON file
    data = load_data(input_file)
    train_data = data[:int(len(data) * 0.8)]
    dev_data = data[int(len(data) * 0.8):]

    # Step 2: Convert data to spaCy binary format
    train_data_file = "train.spacy"
    dev_data_file = "dev.spacy"
    create_spacy_binary(train_data, train_data_file)
    create_spacy_binary(dev_data, dev_data_file)

    # Step 3: Train the model
    output_model_dir = "output_model"
    train_spacy_model(train_data_file, dev_data_file, output_model_dir, gpu_id=0)

    # Test loading training data
    train_data = DocBin().from_disk("train.spacy").get_docs(spacy.blank("en").vocab)
    print(f"Loaded {len(list(train_data))} training documents")

    # Test loading dev data
    dev_data = DocBin().from_disk("dev.spacy").get_docs(spacy.blank("en").vocab)
    print(f"Loaded {len(list(dev_data))} dev documents")