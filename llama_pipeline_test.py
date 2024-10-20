from transformers import pipeline

model = pipeline("text-generation", model="meta-llama/Llama-3.2-1B-Instruct", device="mps")
print(model("Say something incredibly random"))