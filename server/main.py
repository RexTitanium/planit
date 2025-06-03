from fastapi import FastAPI, Request, HTTPException
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS (since frontend = port 3000, backend = port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for now, restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import json
import re

def generate_response(prompt: str) -> str:
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "mistral", "prompt": prompt},
            stream=True,
            timeout=30,
        )
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail="Language model request failed")

    final_text = ""
    for line in response.iter_lines():
        if line:
            parsed = json.loads(line.decode("utf-8"))
            final_text += parsed.get("response", "")
    return final_text

def parse_tasks(raw_text: str):
    tasks = []
    current_task = None

    for line in raw_text.splitlines():
        line = line.strip()
        if not line:
            continue

        # Heading detection (e.g., numbered)
        if re.match(r"^\d+\.", line) or not current_task:
            if current_task:
                tasks.append(current_task)
            current_task = {"title": line.lstrip("0123456789. ").strip(), "subtasks": []}
        else:
            # Subtasks (indented or dash format)
            current_task["subtasks"].append(line.lstrip("-• ").strip())

    if current_task:
        tasks.append(current_task)

    return tasks

@app.get("/")
def read_root():
    return {"message": "Hello from Planit backend!"}

@app.post("/generate-tasks")
async def generate_tasks(request: Request):
    data = await request.json()
    goal = data.get("goal", "")

    # Step 1: DRAFT — Give clear structure + specificity requirements
    draft_prompt = f"""
You are a personal AI task planner.

Given the user's goal:
"{goal}"

Your job is to return a list of tasks that:
- Are **specific** and **actionable**
- Feel like a realistic **checklist**, not vague advice
- Include **time references**, **tools**, or **outputs** where possible
- Use active phrasing like "Book", "Create", "Compare", "Send", "Review"
- Are grouped under 3–6 MAJOR task categories

Output format:
1. Major Task Title
  - [ ] Subtask (specific action)
  - [ ] Subtask (with tools or outcomes)

Only include tasks — no explanations, no intro, no summaries. Begin:
"""


    draft_text = generate_response(draft_prompt)

    # Step 2: CRITIQUE — Make it reflect on quality
    critique_prompt = (
        f"Analyze the following task breakdown for:\n"
        f"- Overlap between tasks\n"
        f"- Missing logical steps\n"
        f"- Ambiguity or vagueness\n"
        f"- Potential order/priority issues\n\n"
        f"Task List:\n{draft_text}\n\n"
        f"Write a concise critique with numbered suggestions for improvement."
    )
    critique_text = generate_response(critique_prompt)

    # Step 3: REWRITE — Rebuild based on critique
    rework_prompt = (
        f"Here is a user's goal:\n\"{goal}\"\n\n"
        f"Here is the initial draft breakdown:\n{draft_text}\n\n"
        f"And here is a critique of that draft:\n{critique_text}\n\n"
        "Now rewrite the task plan:\n"
        "- Apply the critique directly\n"
        "- Keep 3-6 major tasks\n"
        "- Ensure each subtask is precise and useful\n"
        "- Maintain clarity, depth, and logical flow\n\n"
        "Format as:\n"
        "1. Major Task Title\n"
        "  - Subtask A\n"
        "  - Subtask B\n"
        "2. Major Task Title\n"
        "  - Subtask A\n"
        "3...\n\n"
        "Only output the improved task plan."
    )
    rework_text = generate_response(rework_prompt)

    # Step 4: Parse output
    structured_tasks = parse_tasks(rework_text)
    return {"tasks": structured_tasks}

