CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS clients 
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,

    country VARCHAR(20) NOT NULL,
    serie VARCHAR(10) NOT NULL,
    number VARCHAR(10) NOT NULL,
    nationality VARCHAR(30) NOT NULL,
    cnp VARCHAR(20) NOT NULL,
    birth_place VARCHAR(30) NOT NULL,
    address VARCHAR(255) NOT NULL,
    issued_by VARCHAR(50) NOT NULL,
    validity VARCHAR(50) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS car_documents
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    property_A VARCHAR(20),
    property_J VARCHAR(20),
    property_D_1 VARCHAR(50),
    property_D_2 VARCHAR(20),
    property_D_3 VARCHAR(30),
    property_E VARCHAR(30),
    property_K VARCHAR(30),
    property_C_2_1 VARCHAR(30),
    property_C_2_2 VARCHAR(40),
    property_C_2_3 VARCHAR(100),
    property_C_3_1 VARCHAR(255),
    property_C_3_2 VARCHAR(255),
    property_C_3_3 VARCHAR(255),
    property_B VARCHAR(15),
    property_H VARCHAR(15),
    property_I VARCHAR(10),
    property_I_1 VARCHAR(15),
    property_F_1 VARCHAR(15),
    property_G VARCHAR(15),
    property_P_1 VARCHAR(15),
    property_P_2 VARCHAR(15),
    property_P_3 VARCHAR(30),
    property_Q VARCHAR(30),
    property_R VARCHAR(30),
    property_S_1 VARCHAR(10),
    property_S_2 VARCHAR(20),
    property_V_7 VARCHAR(30),
    property_V_10 VARCHAR(30),
    property_Y VARCHAR(30),
    property_Z VARCHAR(30),
    observatii TEXT,
    numar_certificat VARCHAR(50),
    property_C_2_equals_C_1 BOOLEAN,
    property_C_3_equals_C_1 BOOLEAN,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

--voi modifica tabela de car documents adaugand o coloana de referinta la client
--relatia este: un client are mai multe car documents
--comportament de stergere: la stergerea clientului se sterge toate car documents asociate
ALTER TABLE car_documents
ADD COLUMN IF NOT EXISTS client_id UUID NOT NULL;

ALTER TABLE car_documents
DROP CONSTRAINT IF EXISTS fk_car_documents_client;

ALTER TABLE car_documents
ADD CONSTRAINT fk_car_documents_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS driver_licenses
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth VARCHAR(20) NOT NULL,
    birth_place VARCHAR(50) NOT NULL,
    issued_date VARCHAR(20) NOT NULL,
    expiration_date VARCHAR(20) NOT NULL,
    issued_by VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE driver_licenses
DROP CONSTRAINT IF EXISTS fk_driver_licenses_client;

ALTER TABLE driver_licenses
ADD CONSTRAINT fk_driver_licenses_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE driver_licenses
ADD COLUMN IF NOT EXISTS vehicle_codes VARCHAR(5)[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS compensation_claims
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,

    attention_to VARCHAR(50) NOT NULL,
    claim_file_number VARCHAR(20) NOT NULL,
    claimant_name VARCHAR(50) NOT NULL,
    cnp VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    registration_number VARCHAR(15) NOT NULL,
    claim_number VARCHAR(20) NOT NULL,
    observations TEXT,
    date VARCHAR(20) NOT NULL,
    signature VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW()
    );

ALTER TABLE compensation_claims
DROP CONSTRAINT IF EXISTS fk_compensation_claims_client;

ALTER TABLE compensation_claims
ADD CONSTRAINT fk_compensation_claims_client
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS compensated_drivers
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL,

    amount VARCHAR(15) NOT NULL,
    bank VARCHAR(50) NOT NULL,
    iban VARCHAR(50) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compensated_drivers
DROP CONSTRAINT IF EXISTS fk_compensated_drivers_claim;

ALTER TABLE compensated_drivers
ADD CONSTRAINT fk_compensated_drivers_claim
FOREIGN KEY (claim_id) REFERENCES compensation_claims(id) ON DELETE CASCADE;

ALTER TABLE compensated_drivers
ADD COLUMN IF NOT EXISTS account_holder VARCHAR(50) NOT NULL;