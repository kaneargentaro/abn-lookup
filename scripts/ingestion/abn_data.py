#!/usr/bin/env python3
"""
ABN Bulk Extract Data Ingestion Script
Processes and uploads ABN data from local files to Supabase
"""

import os
import sys
import zipfile
import xml.etree.ElementTree as ET
from typing import List, Dict, Optional
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv
import requests
from urllib.parse import urlparse

# Load environment variables from root .env file
# TODO: dynamically load in either .env or .env.local based on existence
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / '.env.local'
load_dotenv(dotenv_path=env_path)

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"
SAMPLE_SIZE = int(os.getenv("SAMPLE_SIZE", "100000"))

ABN_DOWNLOAD_URLS = [
    "https://data.gov.au/data/dataset/5bd7fcab-e315-42cb-8daf-50b7efc2027e/resource/0ae4d427-6fa8-4d40-8e76-c6909b5a071b/download/public_split_1_10.zip",
    "https://data.gov.au/data/dataset/5bd7fcab-e315-42cb-8daf-50b7efc2027e/resource/635fcb95-7864-4509-9fa7-a62a6e32b62d/download/public_split_11_20.zip"
]


def setup_directories(base_dir: str) -> tuple[str, str]:
    """Create necessary directories for data processing"""
    raw_dir = os.path.join(base_dir, 'data', 'raw')
    extract_dir = os.path.join(base_dir, 'data', 'extracted')

    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(extract_dir, exist_ok=True)

    print(f"Created directory: {raw_dir}")
    print(f"Created directory: {extract_dir}")

    return raw_dir, extract_dir


def cleanup_directory(dir_path: str) -> None:
    """Remove all files in a directory"""
    if os.path.exists(dir_path):
        print(f"\nCleaning up directory: {dir_path}")
        for root, dirs, files in os.walk(dir_path, topdown=False):
            for name in files:
                file_path = os.path.join(root, name)
                os.remove(file_path)
            for name in dirs:
                dir_path_inner = os.path.join(root, name)
                os.rmdir(dir_path_inner)
        os.rmdir(dir_path)
        print(f"Removed directory: {dir_path}")
    else:
        print(f"Directory does not exist: {dir_path}")


def download_file(url: str, destination: str) -> bool:
    """Download a file from URL to destination with progress indicator"""
    try:
        filename = os.path.basename(urlparse(url).path)
        filepath = os.path.join(destination, filename)

        # Skip if file already exists
        if os.path.exists(filepath):
            file_size = os.path.getsize(filepath)
            print(f"File already exists: {filename} ({file_size:,} bytes)")
            return True

        print(f"\nDownloading: {filename}")
        print(f"From: {url}")

        response = requests.get(url, stream=True)
        response.raise_for_status()

        total_size = int(response.headers.get('content-length', 0))
        block_size = 8192
        downloaded = 0

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=block_size):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)

                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\rProgress: {downloaded:,}/{total_size:,} bytes ({percent:.1f}%)", end='')

        print(f"\nCompleted: {filename} ({downloaded:,} bytes)")
        return True

    except Exception as e:
        print(f"\nError downloading {url}: {e}")
        return False


def extract_zip(zip_path: str, extract_to: str) -> bool:
    """Extract ZIP file"""
    try:
        print(f"Extracting {zip_path}...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print(f"Extracted to: {extract_to}")
        return True
    except Exception as e:
        print(f"Error extracting {zip_path}: {e}")
        return False


def parse_xml_record(record: ET.Element) -> Optional[Dict]:
    """Parse a single ABN XML record into normalized structure"""
    try:
        # Core ABN Record
        abn_elem = record.find('ABN')
        if abn_elem is None:
            return None

        # ABN is the text content, status/date are attributes
        abn = ''.join(abn_elem.text.split()) if abn_elem.text else None
        if not abn or len(abn) != 11:
            return None

        abn_status = abn_elem.get('status')  # ACT, CAN, etc.
        abn_status_from_date = abn_elem.get('ABNStatusFromDate')  # yyyymmdd

        # Record last updated - this is on the parent ABR element
        record_last_updated = record.get('recordLastUpdatedDate')

        # Entity Type
        entity_type_elem = record.find('EntityType')
        entity_type_ind = None
        entity_type_text = None
        if entity_type_elem is not None:
            ind_elem = entity_type_elem.find('EntityTypeInd')
            entity_type_ind = ind_elem.text if ind_elem is not None else None
            text_elem = entity_type_elem.find('EntityTypeText')
            entity_type_text = text_elem.text if text_elem is not None else None

        # Main Entity (for organizations - NonIndividualName)
        main_entity = record.find('MainEntity')
        main_entity_data = None

        if main_entity is not None:
            # Check for NonIndividualName (organization)
            non_individual = main_entity.find('NonIndividualName')
            if non_individual is not None:
                main_entity_data = {
                    'type': non_individual.get('type'),  # e.g., 'MN' for Main Name
                    'text': None
                }
                name_text_elem = non_individual.find('NonIndividualNameText')
                if name_text_elem is not None:
                    main_entity_data['text'] = name_text_elem.text

        # Legal Entity
        legal_entity = record.find('LegalEntity')
        legal_entity_data = None

        if legal_entity is not None:
            individual = legal_entity.find('IndividualName')
            if individual is not None:
                legal_entity_data = {
                    'type': individual.get('type'),
                    'title': None,
                    'given_name_1': None,
                    'given_name_2': None,
                    'family_name': None
                }

                # Name title
                title_elem = individual.find('NameTitle')
                legal_entity_data['title'] = title_elem.text if title_elem is not None else None

                # Given names (can be 0-2)
                given_names = individual.findall('GivenName')
                legal_entity_data['given_name_1'] = given_names[0].text if len(given_names) > 0 else None
                legal_entity_data['given_name_2'] = given_names[1].text if len(given_names) > 1 else None

                # Family name
                family_elem = individual.find('FamilyName')
                legal_entity_data['family_name'] = family_elem.text if family_elem is not None else None

        # Business Address
        business_address_data = None
        main_address_data = None

        if main_entity is not None:
            # BusinessAddress is nested inside MainEntity
            main_address_data = main_entity.find('BusinessAddress')

        if legal_entity is not None and main_address_data is None:
            # BusinessAddress is nested inside LegalEntity
            main_address_data = legal_entity.find('BusinessAddress')

        if main_address_data is not None:
            address_details = main_address_data.find('AddressDetails')
            if address_details is not None:
                state_elem = address_details.find('State')
                postcode_elem = address_details.find('Postcode')
                business_address_data = {
                    'state_code': state_elem.text if state_elem is not None else None,
                    'postcode': postcode_elem.text if postcode_elem is not None else None
                }

        # ASIC Number
        asic_elem = record.find('ASICNumber')
        asic_number = asic_elem.text if asic_elem is not None else None

        # GST Registration
        gst_elem = record.find('GST')
        gst_data = None
        if gst_elem is not None:
            gst_data = {
                'status': gst_elem.get('status'),
                'status_from_date': gst_elem.get('GSTStatusFromDate')
            }

        # DGR Entries (0..n)
        dgr_entries = []
        for dgr_elem in record.findall('DGR'):
            dgr_entry = {
                'status_from_date': dgr_elem.get('DGRStatusFromDate'),
                'status': dgr_elem.get('status'),  # Optional
                'type': None,
                'text': None
            }

            # NonIndividualName is optional within DGR
            dgr_name = dgr_elem.find('NonIndividualName')
            if dgr_name is not None:
                dgr_entry['type'] = dgr_name.get('type')
                name_text_elem = dgr_name.find('NonIndividualNameText')
                dgr_entry['text'] = name_text_elem.text if name_text_elem is not None else None

            dgr_entries.append(dgr_entry)

        # Other Entity Names (0..n)
        other_entities = []
        for other_elem in record.findall('OtherEntity'):
            other_name = other_elem.find('NonIndividualName')
            if other_name is not None:
                other_entry = {
                    'type': other_name.get('type'),
                    'text': None
                }
                name_text_elem = other_name.find('NonIndividualNameText')
                other_entry['text'] = name_text_elem.text if name_text_elem is not None else None
                other_entities.append(other_entry)

        # Return normalized structure
        return {
            'abn_record': {
                'abn': abn,
                'record_last_updated_date': record_last_updated,
                'abn_status': abn_status,
                'abn_status_from_date': abn_status_from_date,
                'entity_type_ind': entity_type_ind,
                'entity_type_text': entity_type_text
            },
            'main_entity': main_entity_data,
            'legal_entity': legal_entity_data,
            'asic_number': asic_number,
            'gst_registration': gst_data,
            'dgr_entries': dgr_entries if dgr_entries else None,
            'other_entity_names': other_entities if other_entities else None,
            'business_address': business_address_data
        }

    except Exception as e:
        print(f"Error parsing record: {e}")
        import traceback
        traceback.print_exc()
        return None


def process_xml_file(file_path: str, current_count: int = 0, dev_mode: bool = True, sample_size: int = 100000) -> List[
    Dict]:
    """Process XML file and extract business records"""
    print(f"\nProcessing XML file: {file_path}")
    records = []

    try:
        context = ET.iterparse(file_path, events=('end',))
        count = 0

        for event, elem in context:
            # Process full ABR blocks
            if elem.tag.endswith('ABR'):
                record = parse_xml_record(elem)
                if record:
                    records.append(record)
                    count += 1

                    # Progress update so we know records are being processed
                    if count % 10000 == 0:
                        print(f"Processed {count:,} valid records...")

                # Clear the element to free memory
                # TODO: is there a better way to free memory?
                elem.clear()

            # In dev mode, stop early if we have enough samples
            if dev_mode and (current_count + count) >= sample_size:
                print(f"Reached sample size of {sample_size:,} records, stopping early.")
                break

    except Exception as e:
        print(f"Error processing XML file: {e}")

    return records


def upload_to_supabase(records: List[Dict], batch_size: int = 1000) -> bool:
    """Upload records to Supabase in batches using normalized schema"""
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"\nUploading {len(records):,} records in batches of {batch_size}...")

        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]

            try:
                # Prepare batch data for all tables
                abn_batch = []
                main_entity_batch = []
                legal_entity_batch = []
                asic_batch = []
                gst_batch = []
                dgr_batch = []
                other_names_batch = []
                address_batch = []

                abns_in_batch = [r['abn_record']['abn'] for r in batch]

                # Collect all data for batch
                for record in batch:
                    abn = record['abn_record']['abn']
                    abn_batch.append({**record['abn_record']})

                    if record['main_entity']:
                        main_entity_batch.append({'abn': abn, **record['main_entity']})
                    if record['legal_entity']:
                        legal_entity_batch.append({'abn': abn, **record['legal_entity']})
                    if record['asic_number']:
                        asic_batch.append({'abn': abn, 'asic_number': record['asic_number']})
                    if record['gst_registration']:
                        gst_batch.append({'abn': abn, **record['gst_registration']})
                    if record['dgr_entries']:
                        dgr_batch.extend([{'abn': abn, **e} for e in record['dgr_entries']])
                    if record['other_entity_names']:
                        other_names_batch.extend([{'abn': abn, **e} for e in record['other_entity_names']])
                    if record['business_address']:
                        address_batch.append({'abn': abn, **record['business_address']})

                # Execute batch operations
                supabase.table('abn_records').upsert(abn_batch, on_conflict='abn').execute()

                if main_entity_batch:
                    supabase.table('main_entity').upsert(main_entity_batch, on_conflict='abn').execute()
                if legal_entity_batch:
                    supabase.table('legal_entity').upsert(legal_entity_batch, on_conflict='abn').execute()
                if asic_batch:
                    supabase.table('asic_numbers').upsert(asic_batch, on_conflict='abn').execute()
                if gst_batch:
                    supabase.table('gst_registrations').upsert(gst_batch, on_conflict='abn').execute()
                if address_batch:
                    supabase.table('business_addresses').upsert(address_batch, on_conflict='abn').execute()

                # Delete old entries in batch
                supabase.table('dgr_entries').delete().in_('abn', abns_in_batch).execute()
                supabase.table('other_entity_names').delete().in_('abn', abns_in_batch).execute()

                if dgr_batch:
                    supabase.table('dgr_entries').insert(dgr_batch).execute()
                if other_names_batch:
                    supabase.table('other_entity_names').insert(other_names_batch).execute()

                print(f"Uploaded {min(i + batch_size, len(records)):,}/{len(records):,} records")

            except Exception as e:
                print(f"Batch failed at record {i}: {e}")
                return False

        print(f"Successfully uploaded {len(records):,} records")
        return True

    except Exception as e:
        print(f"Supabase error: {e}")
        return False


def validate_environment():
    """Validate environment setup before starting"""
    print("\n" + "=" * 60)
    print("Validating Environment")
    print("=" * 60)

    errors = []
    warnings = []

    # Check Python version
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        errors.append(f"Python 3.8+ required (found {version.major}.{version.minor})")
    else:
        print(f"Python {version.major}.{version.minor}.{version.micro}")

    # Check .env file exists
    if not env_path.exists():
        errors.append(f".env file not found at {env_path}")
        print(f".env file missing: {env_path}")
    else:
        print(f"Using .env from: {env_path}")

    # Check Supabase credentials
    if not SUPABASE_URL:
        errors.append("SUPABASE_URL not set in .env")
        print("SUPABASE_URL not set")
    else:
        print(f"SUPABASE_URL: {SUPABASE_URL}")

    if not SUPABASE_KEY:
        errors.append("SUPABASE_SERVICE_KEY not set in .env")
        print("SUPABASE_SERVICE_KEY not set")
        print("  (Note: Use service_role key, not anon key)")
    else:
        masked = f"{SUPABASE_KEY[:10]}...{SUPABASE_KEY[-5:]}"
        print(f"✓ SUPABASE_SERVICE_KEY: {masked}")

    # Check dependencies
    try:
        from supabase import create_client
        print("supabase-py installed")
    except ImportError:
        errors.append("supabase-py not installed")
        print("supabase-py not installed")
        print("  Run: pip install -r scripts/ingestion/requirements.txt")

    # Print summary
    print("\n" + "=" * 60)
    if errors:
        print("Validation Failed")
        print("=" * 60)
        for error in errors:
            print(f"  • {error}")
        if warnings:
            print("\nWarnings:")
            for warning in warnings:
                print(f"  • {warning}")
        print("\nFix the errors above and try again.")
        return False
    elif warnings:
        print("Validation Passed with Warnings")
        print("=" * 60)
        for warning in warnings:
            print(f"  • {warning}")
        return True
    else:
        print("All Checks Passed")
        print("=" * 60)
        return True


def main():
    """Main execution function"""
    cwd = os.getcwd()
    raw_dir = None
    extract_dir = None

    try:
        print("=" * 60)
        print("ABN Data Ingestion Script")
        print("=" * 60)
        print(f"Mode: {'DEVELOPMENT (Sampled)' if DEV_MODE else 'PRODUCTION (Full Dataset)'}")
        if DEV_MODE:
            print(f"Sample Size: {SAMPLE_SIZE:,} records")
        print("=" * 60)

        # Validate environment
        if not validate_environment():
            sys.exit(1)

        # Setup directories
        raw_dir, extract_dir = setup_directories(cwd)

        # Download ABN data files
        print("\n" + "=" * 60)
        print("Downloading ABN Data Files")
        print("=" * 60)

        for url in ABN_DOWNLOAD_URLS:
            if not download_file(url, raw_dir):
                print(f"Failed to download {url}")
                sys.exit(1)

        # Extract compressed data files
        print("\n" + "=" * 60)
        print("Extracting Data Files")
        print("=" * 60)

        for filename in os.listdir(raw_dir):
            if filename.endswith('.zip'):
                zip_path = os.path.join(raw_dir, filename)
                if not extract_zip(zip_path, extract_dir):
                    print(f"Failed to extract {zip_path}")
                    sys.exit(1)

        total_processed = 0
        total_uploaded = 0

        for root, dirs, files in os.walk(extract_dir):
            xml_files = [f for f in files if f.endswith('.xml')]
            print(f"\nFound {len(xml_files)} XML files in: {root}")

            for file in xml_files:
                xml_path = os.path.join(root, file)

                if DEV_MODE and total_processed >= SAMPLE_SIZE:
                    print(f"\nReached dev mode limit of {SAMPLE_SIZE:,} records")
                    break

                records = process_xml_file(
                    xml_path,
                    current_count=total_processed,
                    dev_mode=DEV_MODE,
                    sample_size=SAMPLE_SIZE
                )

                if records:
                    print(f"\nProcessed {len(records):,} records from {file}")
                    if upload_to_supabase(records):
                        total_uploaded += len(records)
                        total_processed += len(records)
                        print(f"Progress: {total_processed:,} total records processed")
                    else:
                        print(f"Failed to upload records from {file}")
                        sys.exit(1)

                    records.clear()
                    del records
                else:
                    print(f"No valid records found in {file}")

        print("\n" + "=" * 60)
        print(f"Successfully processed {total_processed:,} records")
        print(f"Successfully uploaded {total_uploaded:,} records")
        print("=" * 60)

    finally:
        if extract_dir:
            cleanup_directory(extract_dir)
        if raw_dir:
            cleanup_directory(raw_dir)


if __name__ == "__main__":
    main()
