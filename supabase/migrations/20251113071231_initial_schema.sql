-- Normalized ABN Schema
-- Migration: 20251113071231_initial_schema

-- Core ABN Records Table
CREATE TABLE IF NOT EXISTS abn_records
(
    abn                      CHAR(11) PRIMARY KEY, -- ABN Number (11 char)
    record_last_updated_date DATE    NOT NULL,

    abn_status               CHAR(3) NOT NULL,     -- ACT, CAN, etc.
    abn_status_from_date     DATE    NOT NULL,

    entity_type_ind          CHAR(4),              -- IND, PRV, PUB, etc.
    entity_type_text         VARCHAR(100),

    created_at               TIMESTAMPTZ DEFAULT NOW(),
    updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- Main Entity Names (0:1 per ABN)
-- For organizations (NonIndividualName)
CREATE TABLE IF NOT EXISTS main_entity
(
    abn        CHAR(11) PRIMARY KEY REFERENCES abn_records (abn) ON DELETE CASCADE,

    type       VARCHAR(3) NOT NULL, -- MN = Main Name
    text       VARCHAR(200),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legal Entity Names (0:1 per ABN)
-- For individuals (IndividualName)
CREATE TABLE IF NOT EXISTS legal_entity
(
    abn          CHAR(11) PRIMARY KEY REFERENCES abn_records (abn) ON DELETE CASCADE,

    type         VARCHAR(3) NOT NULL, -- IND
    title        VARCHAR(50),
    given_name_1 VARCHAR(100),
    given_name_2 VARCHAR(100),
    family_name  VARCHAR(50),

    created_at   TIMESTAMPTZ DEFAULT NOW()
);



-- ASIC Numbers (0..1 per ABN)
-- For companies registered with ASIC
CREATE TABLE IF NOT EXISTS asic_numbers
(
    abn         CHAR(11) PRIMARY KEY REFERENCES abn_records (abn) ON DELETE CASCADE,
    asic_number CHAR(9) NOT NULL, -- 9 digit ACN/ARBN

    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- GST Registration (0..1 per ABN)
CREATE TABLE IF NOT EXISTS gst_registrations
(
    abn              CHAR(11) PRIMARY KEY REFERENCES abn_records (abn) ON DELETE CASCADE,

    status           CHAR(3) NOT NULL, -- Registered, etc.
    status_from_date DATE    NOT NULL,

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- DGR Entries (0..n per ABN)
-- Deductible Gift Recipient status
CREATE TABLE IF NOT EXISTS dgr_entries
(
    id               BIGSERIAL PRIMARY KEY,
    abn              CHAR(11) NOT NULL REFERENCES abn_records (abn) ON DELETE CASCADE,

    status_from_date DATE     NOT NULL,
    type             VARCHAR(3),
    text             VARCHAR(200),

    created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Other Entity Names (0..n per ABN)
-- Alternative names/entities
CREATE TABLE IF NOT EXISTS other_entity_names
(
    id         BIGSERIAL PRIMARY KEY,
    abn        CHAR(11)   NOT NULL REFERENCES abn_records (abn) ON DELETE CASCADE,

    type       VARCHAR(3) NOT NULL,
    text       VARCHAR(200),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Address (0..1 per ABN)
CREATE TABLE IF NOT EXISTS business_addresses
(
    abn        CHAR(11) PRIMARY KEY REFERENCES abn_records (abn) ON DELETE CASCADE,

    state_code VARCHAR(3), -- NSW, VIC, QLD, etc.
    postcode   VARCHAR(4), -- Australian postcodes are 4 digits

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE abn_records
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE main_entity
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_entity
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE asic_numbers
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_registrations
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE dgr_entries
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_entity_names
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_addresses
    ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Allow public read access" ON abn_records FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON main_entity FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON legal_entity FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON asic_numbers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON gst_registrations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON dgr_entries FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON other_entity_names FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON business_addresses FOR SELECT USING (true);

-- Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW(); RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER update_abn_records_updated_at
    BEFORE UPDATE
    ON abn_records
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comments for Documentation
COMMENT ON TABLE abn_records IS 'Core ABN records from ABR Bulk Extract';
COMMENT ON TABLE main_entity IS 'Primary entity name (organization)';
COMMENT ON TABLE legal_entity IS 'Primary entity name (individual)';
COMMENT ON TABLE asic_numbers IS 'ASIC registration numbers (ACN/ARBN)';
COMMENT ON TABLE gst_registrations IS 'GST registration status';
COMMENT ON TABLE dgr_entries IS 'Deductible Gift Recipient endorsements (0..n per ABN)';
COMMENT ON TABLE other_entity_names IS 'Additional entity names (0..n per ABN)';
COMMENT ON TABLE business_addresses IS 'Registered business address';