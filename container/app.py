import os
import subprocess
import boto3

import json

# Configuration for standard video resolutions
video_config = [
    {'res': '1080p', 'width': 1920, 'height': 1080, 'pixels': 1920 * 1080},
    {'res': '720p', 'width': 1280, 'height': 720, 'pixels': 1280 * 720},
    {'res': '480p', 'width': 854, 'height': 480, 'pixels': 854 * 480},
    {'res': '360p', 'width': 640, 'height': 360, 'pixels': 640 * 360},
    {'res': '240p', 'width': 426, 'height': 240, 'pixels': 426 * 240}
]
def classify_resolution(pixels):
    """
    Classifies the resolution based on width and height using predefined standards.
    """
    
    for resolution in video_config:
        if pixels >= resolution['pixels']:
            return resolution['res']
    return 'custom'

def get_video_resolution(input_file):
    """
    Uses ffprobe to get the resolution of the input video.
    """
    command = [
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height',
        '-of', 'json', input_file
    ]
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    resolution_data = json.loads(result.stdout)
    width = resolution_data['streams'][0]['width']
    height = resolution_data['streams'][0]['height']
    pixels = width * height
    resolution_label = classify_resolution(pixels)
    return width, height, pixels, resolution_label


def transcode_video(input_file, output_file, resolution):
    """
    Transcode the video to a different resolution.
    """
    command = [
        'ffmpeg', '-i', input_file,
        '-vcodec', 'libx264', '-preset', 'veryfast', '-crf', '23',
        '-max_muxing_queue_size', '1024',
        '-pix_fmt', 'yuv420p',
        '-s', resolution,
        output_file
    ]
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"TRANSCODED => {input_file} to {output_file}", flush=True)

def download_file(bucket_name, file_key, local_filename):
    s3 = boto3.client('s3')
    s3.download_file(bucket_name, file_key, local_filename)
    print(f"DOWNLOADED => {file_key} to {local_filename}", flush=True)


def upload_file(bucket_name, file_key, local_filename):
    s3 = boto3.client('s3')
    s3.upload_file(local_filename, bucket_name, file_key)
    print(f"UPLOADED => {local_filename} to {bucket_name}/{file_key}", flush=True)
    return f'https://{bucket_name}.s3.amazonaws.com/{file_key}'

def deleteTempFile(bucket_name, file_key):
    s3 = boto3.client('s3')
    s3.delete_object(Bucket=bucket_name, Key=file_key)
    print(f"DELETED => {bucket_name}/{file_key}", flush=True)


def saveLinksToDB(table_name, aid, links):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    # Update the item in DynamoDB where the primary key (aid) matches
    response = table.update_item(
        Key={
            'aid': aid  # Primary key of the item to update
        },
        UpdateExpression="SET #lnk = :links, #sts = :status",
        ExpressionAttributeNames={
            "#lnk": "links",
            "#sts": "status"
        },
        ExpressionAttributeValues={
            ":links": links,
            ":status": "completed"
        },
        ReturnValues="UPDATED_NEW"  # Returns the attribute values as they appear after the UpdateItem operation.
    )
    print(f"Updated item with aid {aid}: {response}", flush=True)
    return response

def main():
    # Env Variables
    input_bucket = os.getenv('INPUT_BUCKET_NAME', 'trancodingservice-temp')
    output_bucket = os.getenv('OUTPUT_BUCKET_NAME', 'trancodingservice-temp')
    output_dir = os.getenv('OUTPUT_DIRECTORY', 'transcoding-videos/')
    uid = os.getenv('USER_ID', 'uid')
    aid = os.getenv('ASSET_ID', 'aid')
    mime = os.getenv("FILE_MIME_TYPE", ".mp4")
    # Constants
    file_key = aid+mime
    local_input = f'/app/{file_key}'
    local_output = f'/app/output/{file_key}'
    # Variables
    asset_entry = {}
    skip_original_resolution = True

    try:
        # 1. DOWNLOAD TEMP FILE
        download_file(input_bucket, file_key, local_input)

        # 2. GET VIDEO DATA
        width, height, pixels, resolution_label = get_video_resolution(local_input)
        print(f"Original resolution: {width}x{height} classified as {resolution_label}")

        # 3. COPY ORIGINAL FILES
        original_file_key = f'{output_dir}{uid}/{aid}_{resolution_label}{mime}'
        print(f"ORIGINAL VIDEO => {original_file_key}")
        link = upload_file(output_bucket, original_file_key, local_input)
        asset_entry[resolution_label] = link

        # MAKE OUTPUT DIRECTORY
        subprocess.run(['mkdir', '-p', '/app/output'])
        for data in video_config:
            if data['pixels'] > pixels:
                # SKIP HIGHER RESOLUTIONS
                continue
            if(skip_original_resolution):
                # ORIGINAL FILE ALREADY UPLOADED - (SKIP THIS RESOLUTION)
                skip_original_resolution = False
                continue
            # 4. TRANSCODING
            transcoded_local_output = local_output.replace(mime, f"_{data['res']}{mime}")
            transcoded_file_key = f"{output_dir}{uid}/{aid}_{data['res']}{mime}"
            print(f"{transcoded_local_output} processing...", flush=True)
            transcode_video(local_input, transcoded_local_output, f"{data['width']}x{data['height']}")
            # 5. UPLOADING
            link = upload_file(output_bucket, transcoded_file_key, transcoded_local_output)
            asset_entry[data['res']] = link
            subprocess.run(['rm', transcoded_local_output])
    except(Exception) as e:
        print(e, flush=True)
    finally:
        # 6. SAVE TO DB
        saveLinksToDB('assets', aid, asset_entry)
        # 7. DELETE TEMP FILE
        deleteTempFile(input_bucket, file_key)

if __name__ == '__main__':
    main()
