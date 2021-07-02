import boto3
from os import environ
import uuid

S3_USER_BUCKET = environ.get('S3_USER_BUCKET')
S3_SERVER_BUCKET = environ.get('S3_SERVER_BUCKET')
S3_ID = environ.get('S3_ID')

S3_BUCKETS = {
    'profile': S3_USER_BUCKET,
    'server': S3_SERVER_BUCKET
}

URL_SCHEME = 'https://'
URL_DOMAIN = '.s3.amazonaws.com/'
ALLOWED_EXTENSIONS = {'png', 'jpeg', 'jpg'}

s3_client = boto3.client(
    's3',
    aws_access_key_id=environ.get('S3_KEY'),
    aws_secret_access_key=environ.get('S3_SECRET')
)


def upload_photo_to_s3(photo, bucket):
    try:
        s3_client.upload_fileobj(
            photo,
            S3_BUCKETS[bucket],
            photo.filename,
            ExtraArgs={
                'ACL': 'public-read',
                'ContentType': photo.content_type,
            })
    except Exception as e:
        # Do error handling
        pass
    return {'photo_url': f'{URL_SCHEME}{S3_BUCKETS[bucket]}{URL_DOMAIN}{photo.filename}'}


def delete_photo_from_s3(bucket, filename):
    return s3_client.delete_object(Bucket=bucket, Key=filename)


def valid_file_type(filename):
    file_arr = filename.lower().split('.')
    return len(file_arr) > 1 and file_arr[-1] in ALLOWED_EXTENSIONS


def get_unique_filename(filename):
    ext = filename.lower().split('.')[-1]
    uuid_filename = uuid.uuid4()
    return f'{uuid_filename}.{ext}'
