# abn-lookup

A full-stack application for searching and analyzing Australian Business Number (ABN) data from the Australian Business Register (ABR).

## Technical Test Requirements

- Access data from here - https://data.gov.au/data/dataset/abn-bulk-extract. You should use this dataset in your
  assignment. Do NOT create fake or dummy dataset.
- Clean, merge and normalize the dataset and ingest into a database of your choice.
- Create a clean UI that allows users to search the underlying data in different ways. Some companies that do this
  as https://www.zoominfo.com/, https://www.lusha.com/, https://apollo.io/ . You can look at these for ideas and use
  your own.
- Send us a link to a working prototype that is deployed and hosted in a cloud environment of your choice. Please note,
  both front end and backend need to be deployed, and the data needs to be accessed via an API
- Please include a few slides that explains the architecture and potential improvements that you would like to
  undertake.

## Overview

This project processes 20+ million ABN records from the official ABN Bulk Extract dataset, normalizes the data into a relational schema, and provides a searchable interface for users to explore Australian business information.

### Database Schema

The ABN data is normalized across 8 tables:

1. **`abn_records`** - Core ABN information (11-char ABN, status, entity type)
2. **`main_entity`** - Organization names (0..1 per ABN)
3. **`legal_entity`** - Individual names (0..1 per ABN)
4. **`asic_numbers`** - ASIC registration numbers (0..1 per ABN)
5. **`gst_registrations`** - GST status (0..1 per ABN)
6. **`dgr_entries`** - Deductible Gift Recipient status (0..n per ABN)
7. **`other_entity_names`** - Alternative entity names (0..n per ABN)
8. **`business_addresses`** - Registered business addresses (0..1 per ABN)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.8+
- **Supabase CLI** (optional, for local development)
- **Supabase Account** (for database hosting)

### Installation

1. **Install dependencies:**

   ```bash
   npm install

   # Install Python dependencies for data ingestion
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate
   cd scripts/ingestion
   pip install -r requirements.txt
   cd ../..
   ```

2. **Configure environment variables:**

   Create `.env.local` in the project root:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key

   # Data Ingestion Configuration
   DEV_MODE=true
   SAMPLE_SIZE=100000
   ```

   **Important:** Use the `service_role` key for `SUPABASE_SERVICE_KEY`, not the `anon` key. The service role key bypasses Row Level Security (RLS) for data ingestion.

---

## Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Link Supabase Project**

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref
```

3. **Push Migrations**

```
# Push all migrations
npm run db:migrate
```

Note: You can reset the database if needed:

```bash
# Or reset database (WARNING: deletes all data)
npm run db:reset
```

### Generate TypeScript Types

After setting up the database schema:

```bash
npm run generate:types
```

This generates type-safe database types in `apps/web/src/types/database.ts`.

---

## Data Ingestion

The data ingestion script downloads, processes, and uploads ABN data from data.gov.au to your Supabase database.

### How It Works

1. **Download:** Fetches 2 ZIP files containing 20M+ ABN records
2. **Extract:** Unzips to temporary directory
3. **Parse:** Processes XML files using streaming parser to prevent memory issues
4. **Upload:** Batch uploads to Supabase (1000 records per batch)
5. **Cleanup:** Removes temporary files

### Running the Ingestion

**Development Mode** (processes 100,000 records):

```bash
# Set environment variables or update .env.local
export DEV_MODE=true
npm run setup:data
```

**Production Mode** (processes all 20M+ records):

```bash
# Set environment variables or update .env.local
export DEV_MODE=false
npm run setup:data
```

---

## Development

### Run the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

### Project Structure

[TODO]

## Deployment

### Supabase

- Database is automatically hosted on Supabase cloud
- No additional configuration needed after initial setup

### Frontend

[TODO]

### Environment Variables for Production

Ensure the following are set in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Do NOT expose `SUPABASE_SERVICE_KEY` to the frontend

---
