import requests

res = requests.post("https://trancoding-service.vercel.app/api/redis-tasks")
print(res.json())