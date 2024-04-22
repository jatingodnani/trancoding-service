import os
import subprocess
import boto3

def download_file(bucket_name, file_key, local_filename):
    s3 = boto3.client('s3')
    s3.download_file(bucket_name, file_key, local_filename)
    print(f"DOWNLOADED => {file_key} to {local_filename}")

def transcode_video(input_file, output_file, resolution):
    command = [
        'ffmpeg', '-i', input_file,
        '-vcodec', 'libx264', '-preset', 'veryfast', '-crf', '23',  # Use H.264 video codec
        '-max_muxing_queue_size', '1024',  # Increase max video queue size
        '-pixel_format', 'yuv420p',  # Use YUV 4:2:0 pixel format for compatibility
        '-s', resolution,  # Set 360p resolution
        output_file
    ]
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"TRANSCODED => {input_file} to {output_file}")

def upload_file(bucket_name, file_key, local_filename):
    s3 = boto3.client('s3')
    s3.upload_file(local_filename, bucket_name, file_key)
    print(f"UPLOADED => {local_filename} to {bucket_name}/{file_key}")


def main():
    # Fetching environment variables
    input_bucket = os.getenv('INPUT_BUCKET_NAME', 'default-input-bucket')
    output_bucket = os.getenv('OUTPUT_BUCKET_NAME', 'default-output-bucket')
    file_key = os.getenv('FILE_KEY', 'video.mp4')

    local_input = f'/app/{file_key}'
    local_output = f'/app/output/{file_key}'

    # download_file(input_bucket, file_key, local_input)
    config = [['240p','320x240'],['360p', '640x360'], ['480p', '640x480'], ['720p', '1280x720'], ['1080p', '1920x1080']]
    subprocess.run(['mkdir', '-p', '/app/output'])
    for config in config:
        transcoded_file_output = local_output.replace('.mp4', f'_{config[0]}.mp4')
        transcoded_file_key = file_key.replace('.mp4', f'_{config[0]}.mp4')
        transcode_video(local_input, transcoded_file_output, config[1])
        # upload_file(output_bucket, transcoded_file_key, transcoded_file_output)
        subprocess.run(['rm', transcoded_file_output])

if __name__ == '__main__':
    main()
