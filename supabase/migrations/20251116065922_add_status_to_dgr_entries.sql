-- Add the status field to the DGR Entries table
-- Migration: 20251116065922_add_status_to_dgr_entries

ALTER TABLE public.dgr_entries
    ADD COLUMN status VARCHAR(100);