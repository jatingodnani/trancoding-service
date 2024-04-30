import requests

res = requests.get("https://trancoding-service.vercel.app/api/trigger-task")
print(res.json())