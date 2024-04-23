FROM python:3.9-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./app.py .
COPY ./requirements.txt .
# COPY . .


# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

ENV INPUT_BUCKET_NAME="jat-twitter-dev"
ENV OUTPUT_BUCKET_NAME="jat-twitter-dev"
# ENV INPUT_FILE_KEY="video.mp4"
ENV OUTPUT_DIRECTORY="transcoding-videos/"
ENV ASSET_ID="aid"
ENV USER_ID="uid"
ENV FILE_MIME_TYPE=".mp4"

# CMD tail -f /dev/null
CMD ["python", "app.py"]

