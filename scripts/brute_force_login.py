import requests

LOGIN_URL = "http://localhost:3000/api/v1/auth/login"
LOGIN_DATA = { "email": "test@gmail.com", "password": "test123445"}

def brute_force_login():
    response = requests.post(LOGIN_URL, json=LOGIN_DATA)
    try:
        return response.json()
    except:
        return response.text

for i in range(5):
    response = brute_force_login()
    print(f"Attempt-{i}: ", response)
