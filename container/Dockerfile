FROM python:3.9-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./app.py .
COPY ./requirements.txt .
# COPY ./app-dev.py .
# COPY ./video.mp4 .


# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# RUN ffmpeg -i video.mp4 -vf scale=1280:720 -preset slow -crf 18 output.mp4


EXPOSE 8000

ENV INPUT_BUCKET_NAME="jat-twitter-dev"
ENV OUTPUT_BUCKET_NAME="jat-twitter-dev"
ENV INPUT_FILE_KEY="video.mp4"
ENV OUTPUT_DIRECTORY=""

# CMD ["python", "app-dev.py"]
CMD ["python", "app.py"]
