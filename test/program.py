import redis
import json
def main():
    redis_uri = 'rediss://default:AVNS_ZbezrGz6bc8ptjPUUgX@video-transcoding-redis-kartikjoshiuk-4407.d.aivencloud.com:12321'
    redis_client = redis.from_url(redis_uri)
    task = {
        "uid" : "kartik",
        "aid" : "task-1",
        "key" : "/video.mp4"
    }
    json_object = json.dumps(task, indent = 4) 
    # print(json_object)
    redis_client.lpush("myqueue", json_object)
    redis_client.lpush("myqueue", json_object)
    # key = redis_client.get('key').decode('utf-8')
    key = redis_client.rpop("myqueue").decode('utf-8')
    print('The value of key is:', key)
    key = redis_client.rpop("myqueue").decode('utf-8')
    print('The value of key is:', key)
    key = redis_client.rpop("myqueue").decode('utf-8')
    print('The value of key is:', key)


if __name__ == '__main__':
    main()