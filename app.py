import os
from flask import Flask, render_template, request
from openai import OpenAI
from dotenv import load_dotenv

app = Flask(__name__)

client = OpenAI(
    base_url="http://127.0.0.1:1234/v1",
    api_key="lm-studio",
    timeout=120
)
MODEL_NAME = "google/gemma-4-e4b"

def convert_code(code, target_lang):
    prompt = f"Convert this code to {target_lang}. Return only executable code:\n\n{code}"
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=2000
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

def fix_code(code):
    prompt = f"Fix all bugs in this code and return only the corrected executable code:\n\n{code}"
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=2000
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("index.html")

@app.route("/converter", methods=["GET", "POST"])
def converter():
    code = ""
    result = ""
    if request.method == "POST":
        code = request.form.get("code", "")
        target = request.form.get("language", "")
        if code and target:
            result = convert_code(code, target)
    return render_template("converter.html", result=result, code=code)

@app.route("/fixer", methods=["GET", "POST"])
def fixer():
    code = ""
    result = ""
    if request.method == "POST":
        code = request.form.get("code", "")
        if code:
            result = fix_code(code)
    return render_template("fixer.html", result=result, code=code)

if __name__ == "__main__":
    app.run(debug=True)

