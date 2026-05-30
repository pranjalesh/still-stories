#!/usr/bin/env python3
"""
Still Stories — Photo Upload Script
Uploads a photo to Cloudinary and inserts a row into the Supabase photos table.

Usage:
    python upload_photo.py --file ./photo.jpg --category urban --title "rainy commute"

Required packages:
    pip install cloudinary supabase python-dotenv

Reads environment variables from .env.local in the project root.
"""

import argparse
import os
import sys
from pathlib import Path

# Load env vars from .env.local (one level up from /scripts)
try:
    from dotenv import load_dotenv
except ImportError:
    print("Error: python-dotenv not installed. Run: pip install python-dotenv")
    sys.exit(1)

env_path = Path(__file__).resolve().parent.parent / ".env.local"
if not env_path.exists():
    print(f"Warning: .env.local not found at {env_path}. Falling back to environment variables.")
else:
    load_dotenv(dotenv_path=env_path)

try:
    import cloudinary
    import cloudinary.uploader
except ImportError:
    print("Error: cloudinary not installed. Run: pip install cloudinary")
    sys.exit(1)

try:
    from supabase import create_client, Client
except ImportError:
    print("Error: supabase not installed. Run: pip install supabase")
    sys.exit(1)


VALID_CATEGORIES = {"candid", "urban", "night", "people"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Upload a photo to Cloudinary and record it in Supabase."
    )
    parser.add_argument(
        "--file",
        required=True,
        help="Path to the image file to upload.",
    )
    parser.add_argument(
        "--category",
        required=True,
        choices=list(VALID_CATEGORIES),
        help="Photo category: candid, urban, night, or people.",
    )
    parser.add_argument(
        "--title",
        required=False,
        default="",
        help="Optional title for the photo.",
    )
    return parser.parse_args()


def validate_env() -> dict:
    required = [
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        print(f"Error: Missing environment variables: {', '.join(missing)}")
        print("Copy .env.local.example to .env.local and fill in the values.")
        sys.exit(1)

    return {
        "cloudinary_cloud_name": os.environ["CLOUDINARY_CLOUD_NAME"],
        "cloudinary_api_key": os.environ["CLOUDINARY_API_KEY"],
        "cloudinary_api_secret": os.environ["CLOUDINARY_API_SECRET"],
        "supabase_url": os.environ["NEXT_PUBLIC_SUPABASE_URL"],
        "supabase_key": os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    }


def upload_to_cloudinary(file_path: str, category: str, env: dict) -> dict:
    """Upload file to Cloudinary under still-stories/{category}/."""
    cloudinary.config(
        cloud_name=env["cloudinary_cloud_name"],
        api_key=env["cloudinary_api_key"],
        api_secret=env["cloudinary_api_secret"],
        secure=True,
    )

    folder = f"still-stories/{category}"
    print(f"Uploading {file_path} to Cloudinary folder '{folder}'...")

    result = cloudinary.uploader.upload(
        file_path,
        folder=folder,
        transformation=[
            {"width": 800, "quality": "auto", "fetch_format": "auto"}
        ],
        resource_type="image",
    )

    return {
        "public_id": result["public_id"],
        "secure_url": result["secure_url"],
        "width": result.get("width"),
        "height": result.get("height"),
    }


def insert_into_supabase(
    title: str,
    category: str,
    cloudinary_url: str,
    cloudinary_public_id: str,
    env: dict,
) -> dict:
    """Insert a photo record into the Supabase photos table."""
    supabase: Client = create_client(env["supabase_url"], env["supabase_key"])

    print("Inserting record into Supabase...")

    response = (
        supabase.table("photos")
        .insert(
            {
                "title": title,
                "category": category,
                "cloudinary_url": cloudinary_url,
                "cloudinary_public_id": cloudinary_public_id,
            }
        )
        .execute()
    )

    if not response.data:
        raise RuntimeError(f"Supabase insert returned no data: {response}")

    return response.data[0]


def main():
    args = parse_args()

    # Validate file exists
    file_path = Path(args.file).resolve()
    if not file_path.exists():
        print(f"Error: File not found: {file_path}")
        sys.exit(1)

    if not file_path.is_file():
        print(f"Error: Path is not a file: {file_path}")
        sys.exit(1)

    # Validate environment
    env = validate_env()

    # Upload to Cloudinary
    try:
        upload_result = upload_to_cloudinary(str(file_path), args.category, env)
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        sys.exit(1)

    # Insert into Supabase
    try:
        db_record = insert_into_supabase(
            title=args.title,
            category=args.category,
            cloudinary_url=upload_result["secure_url"],
            cloudinary_public_id=upload_result["public_id"],
            env=env,
        )
    except Exception as e:
        print(f"Error inserting into Supabase: {e}")
        print(f"Cloudinary upload succeeded — public_id: {upload_result['public_id']}")
        sys.exit(1)

    print("\n✓ Upload complete!")
    print(f"  Title:       {args.title or '(none)'}")
    print(f"  Category:    {args.category}")
    print(f"  Public ID:   {upload_result['public_id']}")
    print(f"  URL:         {upload_result['secure_url']}")
    print(f"  DB row ID:   {db_record.get('id')}")


if __name__ == "__main__":
    main()
