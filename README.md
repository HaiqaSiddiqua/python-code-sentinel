# Python Code Sentinel

An AI-powered **static analysis and bug detection tool** built with **Python**.
This project helps developers automatically **detect bugs**, **generate unit tests**, and **analyze code quality** using AI + static analysis tools.

---

## 🚀 Features

* **Automated Bug Detection** – Identify logical errors and code smells.
* **Test Case Generation** – Auto-generate Python unit tests.
* **Static Analysis** – Integrated linting with `pylint` for style & code quality.
* **Documentation Generator** – Create structured documentation for Python code.

---

## 🛠️ Tech Stack

* **Core Language**: Python 3.10+
* **AI Integration**: Gemini API (for intelligent analysis & test generation)
* **Libraries / Tools**:

  * `pylint` – Static code analysis
  * `unittest` – Auto-generated test cases
  * `ast` – Python AST parsing for code structure
  * `requests` / `httpx` – API calls to AI services

---

## 📦 Run Locally

### Prerequisites

* [Python](https://www.python.org/) (3.10 or higher recommended)
* Virtual environment setup (`venv` or `conda`)
* Gemini API Key

---

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/HaiqaSiddiqua/python-code-sentinel.git
   cd python-code-sentinel
   ```

2. **Create & activate a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate   # On macOS/Linux
   venv\Scripts\activate      # On Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the root and add:

   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Run the tool**

   ```bash
   python main.py
   ```

---

## 📂 Project Structure

```
python-code-sentinel/
│── src/
│   ├── analysis/         # Static analysis & bug detection logic
│   ├── tests/            # Auto-generated test cases
│   ├── docs/             # Generated documentation
│   ├── main.py           # Entry point
│   ├── services/         # Gemini API integration
│   └── utils/            # Helper functions
│── requirements.txt      # Python dependencies
│── .env                  # API key (ignored in git)
│── README.md             # Project overview
```

---

## 🤝 Contributing

Contributions are welcome!
To contribute:

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Submit a pull request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

