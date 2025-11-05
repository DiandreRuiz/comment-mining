import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from typing import Any, Dict
from openai import OpenAI
from openai import (
    AuthenticationError,
    BadRequestError,
    RateLimitError,
    APIConnectionError,
    APIError,
)
from apig_wsgi import make_lambda_handler

load_dotenv()
app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # or just OpenAI() if env is set

@app.post("/api/evaluate")
def evaluate():
    data: Dict[str, Any] | None = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Missing or invalid JSON"}), 400

    comments = data.get("comments")
    if not isinstance(comments, (list, str)) or (isinstance(comments, list) and not comments):
        return jsonify({"error": "Provide 'comments' as a non-empty list or string"}), 400

    # Normalize comments to a string (keep payload small to avoid 413/token limits)
    comments_text = comments if isinstance(comments, str) else "\n".join(map(str, comments[:200]))

    prompt = (
        "You are analyzing YouTube comments to infer why a channel is successful.\n"
        "- Some comments may be low-signal; discount them.\n"
        "- If evidence is insufficient, say so explicitly.\n"
        "- Write a concise, natural-language explanation.\n\n"
        f"Comments:\n{comments_text}"
    )

    try:
        resp = client.responses.create(
            model="gpt-5",        # use a real, available model
            input=prompt,
            timeout=None,                 # optional timeout (seconds)
        )
        # Prefer output_text for a clean string; fall back to full JSON if needed.)
        analysis_text = getattr(resp, "output_text")
        if analysis_text:
            return jsonify({"analysis": analysis_text}), 200
        else:
            return jsonify({"error": "Unable to access output_text attribute from openai response"})

    # --- Granular error handling for clearer frontend messages ---
    except AuthenticationError as e:
        return jsonify({"error": "Authentication failed. Check OPENAI_API_KEY.", "details": str(e)}), 401
    except RateLimitError as e:
        return jsonify({"error": "Rate limit exceeded. Please retry later.", "details": str(e)}), 429
    except BadRequestError as e:
        return jsonify({"error": "Bad request to OpenAI.", "details": e.message}), 400
    except APIConnectionError as e:
        return jsonify({"error": "Network/connection error talking to OpenAI.", "details": str(e)}), 503
    except APIError as e:
        # Server-side error from OpenAI (5xx)
        status = getattr(e, "status_code", 500)
        return jsonify({"error": "OpenAI server error.", "details": str(e)}), status
    except Exception as e:
        # Catch-all for unexpected issues
        return jsonify({"error": "Unexpected error.", "details": str(e)}), 500
    
# ---- Lambda entry point (no app.run on Lambda) ----
lambda_handler = make_lambda_handler(app)
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)