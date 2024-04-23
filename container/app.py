import os
import subprocess
import boto3

def download_file(bucket_name, file_key, local_filename):
    s3 = boto3.client('s3')
    s3.download_file(bucket_name, file_key, local_filename)
    print(f"DOWNLOADED => {file_key} to {local_filename}", flush=True)

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
    print(f"TRANSCODED => {input_file} to {output_file}", flush=True)

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
    # Fetching environment variables
    input_bucket = os.getenv('INPUT_BUCKET_NAME', 'trancodingservice-temp')
    output_bucket = os.getenv('OUTPUT_BUCKET_NAME', 'trancodingservice-temp')
    file_key = os.getenv('INPUT_FILE_KEY', 'video.mp4')
    output_dir = os.getenv('OUTPUT_DIRECTORY', 'transcoding-videos/')
    aid = os.getenv('ASSET_ID', 'aid')

    local_input = f'/app/{file_key}'
    local_output = f'/app/output/{file_key}'

    download_file(input_bucket, file_key, local_input)
    config = [['240p','320x240'],['360p', '640x360']]
    # config = [['240p','320x240'],['360p', '640x360'], ['480p', '640x480'], ['720p', '1280x720'], ['1080p', '1920x1080']]

    subprocess.run(['mkdir', '-p', '/app/output'])
    asset_entry = {}
    for config in config:
        transcoded_local_output = local_output.replace('.mp4', f'_{config[0]}.mp4')
        transcoded_file_key = output_dir + file_key.replace('.mp4', f'_{config[0]}.mp4')
        transcode_video(local_input, transcoded_local_output, config[1])
        link = upload_file(output_bucket, transcoded_file_key, transcoded_local_output)
        asset_entry[config[0]] = link
        subprocess.run(['rm', transcoded_local_output])
    saveLinksToDB('assets', aid, asset_entry)
    deleteTempFile(input_bucket, file_key)

if __name__ == '__main__':
    main()
