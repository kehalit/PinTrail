import os
from dotenv import load_dotenv

load_dotenv()



from supabase import create_client, Client



# Load Supabase credentials from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BUCKET_NAME = "pintraildb"  # Must match the bucket you created in Supabase


def upload_photo_to_supabase(file_storage, filename: str) -> str:
    """
    Upload file to Supabase Storage and return public URL.
    file_storage: File object from Flask (e.g., request.files['photo'])
    filename: Desired name for storage (must be unique)
    """
    # Convert file to bytes
    file_bytes = file_storage.read()

    # Upload file to the bucket
    response = supabase.storage.from_(BUCKET_NAME).upload(filename, file_bytes)

    if response.status_code != 200 and "Key already exists" not in str(response):
        raise Exception(f"Failed to upload file to Supabase: {response}")

    # Make file public
    supabase.storage.from_(BUCKET_NAME).set_public(filename)

    # Generate public URL
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{filename}"
    return public_url
