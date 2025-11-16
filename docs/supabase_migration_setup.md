# Supabase Migration Setup

This guide will help you set up automatic database migrations using the Supabase CLI.

## Prerequisites

- Supabase CLI installed
- Git repository initialized
- Supabase project created

## Installation

### Install Supabase CLI

**macOS/Linux:**

```bash
brew install supabase/tap/supabase
```

**Windows (via npm):**

```bash
npm install -g supabase
```

**Or use npx (no installation needed):**

```bash
npx supabase [command]
```

## Initial Setup

### 1. Initialize Supabase in Your Project

```bash
# From your project root
supabase init
```

This creates a `supabase/` directory with:

```
supabase/
├── config.toml          # Supabase configuration
├── seed.sql             # Seed data (optional)
└── migrations/          # Migration files (empty initially)
```

### 2. Link to Your Remote Project

```bash
supabase link --project-ref vqtjdwczecnaqddxlsuz
```

You'll be prompted for your database password. This links your local setup to your Supabase project.

### 3. Pull Existing Schema (if any)

If you've already created tables in Supabase:

```bash
supabase db pull
```

This will create a migration file from your existing schema.

## Creating Migrations

### Method 1: Write SQL Directly

Create a new migration:

```bash
supabase migration new initial_schema
```

This creates a file like: `supabase/migrations/20241113120000_initial_schema.sql`

Edit this file and add your schema.

### Method 2: Generate from Changes

1. Make changes in Supabase Studio UI
2. Pull the changes:

```bash
supabase db pull
```

## Running Migrations

### Locally

```bash
# Start local Supabase (optional, for testing)
supabase start

# Apply migrations
supabase db reset
```

### Remote (Production)

```bash
# Push migrations to your remote database
supabase db push
```

## Verification

Check migration status:

```bash
supabase migration list
```

## Git Workflow

Your migrations are now version-controlled:

```bash
git add supabase/
git commit -m "Add initial schema migration"
git push
```

## CI/CD Integration

You can automate migrations in GitHub Actions (see separate artifact).

## Common Commands

```bash
# Create new migration
supabase migration new [name]

# Apply migrations locally
supabase db reset

# Push to remote
supabase db push

# Pull from remote
supabase db pull

# List migrations
supabase migration list

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts
```

## Troubleshooting

### "Not linked to remote project"

Run: `supabase link --project-ref vqtjdwczecnaqddxlsuz`

### "Migration already applied"

Migrations are tracked in `supabase_migrations.schema_migrations` table

### "Permission denied"

Make sure you're using your database password, not the service_role key

## Best Practices

1. **Never edit old migrations** - Create new ones instead
2. **Test migrations locally first** - Use `supabase db reset`
3. **Keep migrations small** - One logical change per migration
4. **Write down migrations** - Include DROP statements for reversibility
5. **Backup before pushing** - Always backup production data first

## Next Steps

After setting this up, you can:

1. Create your initial schema migration
2. Set up GitHub Actions for automatic deployment
3. Generate TypeScript types from your schema
