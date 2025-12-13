import requests

FRAPPE_URL = "https://hrms-ezd-bau.frappehr.com"
API_KEY = "4f9a9585cca5e19"
API_SECRET = "cae23f8118a73ff"


def create_frappe_doc(doctype: str, data: dict):
    url = f"{FRAPPE_URL}/api/resource/{doctype}"

    headers = {
        "Authorization": f"token {API_KEY}:{API_SECRET}",
        "Content-Type": "application/json",
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code not in (200, 201):
        raise Exception(response.text)

    return response.json()
